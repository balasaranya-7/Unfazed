const sendNotification = async ({ type = "in-app", recipient, title, message }) => {
  console.log(`[notification:${type}]`, recipient || "recipient", title || "", message || "");
  return { sent: true, type, recipient, title, message };
};
module.exports = { sendNotification };
