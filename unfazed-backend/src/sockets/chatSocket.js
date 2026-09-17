const jwt = require("jsonwebtoken");

const registerChatSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const therapistId = decoded.therapistId;
      if (!therapistId) return next(new Error("Therapist authentication required"));

      socket.therapistId = therapistId;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`therapist:${socket.therapistId}`);

    socket.on("joinConversation", ({ conversationId } = {}) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
      socket.emit("conversationJoined", { conversationId });
    });

    socket.on("sendMessage", (payload = {}) => {
      const { conversationId, message, senderId, senderRole = "therapist" } = payload;
      if (!conversationId || !message) return;

      const chatMessage = {
        conversationId,
        message: String(message).trim(),
        senderId: senderId || socket.therapistId,
        senderRole,
        therapistId: socket.therapistId,
        sentAt: new Date().toISOString(),
      };

      io.to(`conversation:${conversationId}`).emit("messageReceived", chatMessage);
    });

    socket.on("typing", ({ conversationId, isTyping } = {}) => {
      if (!conversationId) return;
      socket.to(`conversation:${conversationId}`).emit("typing", {
        conversationId,
        isTyping: Boolean(isTyping),
        therapistId: socket.therapistId,
      });
    });

    socket.on("disconnect", () => {
      // Socket.IO handles room cleanup automatically.
    });
  });
};

module.exports = registerChatSocket;
