const Client = require("../models/Client");
const bcrypt = require("bcryptjs");

// =========================================================
// GET ALL CLIENTS
// =========================================================

const getClients = async (req, res) => {
  try {
    const clients = await Client.find({
      therapist: req.therapistId,
    }).sort({ createdAt: -1 });

    res.json({
      clients,
    });
  } catch (error) {
    console.error("Get clients error:", error);

    res.status(500).json({
      message: "Failed to fetch clients",
    });
  }
};

// =========================================================
// GET ONE CLIENT
// =========================================================

const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapistId,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.json({
      client,
    });
  } catch (error) {
    console.error("Get client error:", error);

    res.status(500).json({
      message: "Failed to fetch client",
    });
  }
};

// =========================================================
// GET LOGGED-IN CLIENT
// =========================================================

const getMyClient = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.clientId,
    }).populate(
      "therapist",
      "name email slug bio specializations languages"
    );

    if (!client) {
      return res.status(404).json({
        message: "Client profile not found",
      });
    }

    res.json({
      client,
      therapist: client.therapist || null,
    });
  } catch (error) {
    console.error("Get my client error:", error);

    res.status(500).json({
      message: "Failed to fetch client profile",
    });
  }
};

// =========================================================
// CREATE CLIENT
// =========================================================

const createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      age,
      dateOfBirth,
      gender,
      occupation,
      location,
      tags,
      preferredMode,
      intakeSummary,
      notes,
      consentSigned,
      consentDate,
      status,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    if (password && password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingClient = await Client.findOne({
      therapist: req.therapistId,
      email: normalizedEmail,
    });

    if (existingClient) {
      return res.status(409).json({
        message: "This client already exists",
      });
    }

    const passwordHash = password
      ? await bcrypt.hash(password, 10)
      : "";

    const client = await Client.create({
      therapist: req.therapistId,

      name,
      email: normalizedEmail,

      password_hash: passwordHash,

      phone: phone || "",

      age: age || null,
      dateOfBirth: dateOfBirth || null,

      gender: gender || "",

      occupation: occupation || "",
      location: location || "",

      tags: Array.isArray(tags) ? tags : [],

      preferredMode: preferredMode || "",

      intakeSummary: {
        primaryConcern:
          intakeSummary?.primaryConcern || "",

        medicalHistory:
          intakeSummary?.medicalHistory || "",

        emergencyContact:
          intakeSummary?.emergencyContact || "",
      },

      notes: notes || "",

      consentSigned: consentSigned || false,
      consentDate: consentDate || null,

      status: status || "Active",
    });

    res.status(201).json({
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    console.error("Create client error:", error);

    res.status(500).json({
      message: "Failed to create client",
    });
  }
};

// =========================================================
// UPDATE CLIENT
// =========================================================

const updateClient = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      age,
      dateOfBirth,
      gender,
      occupation,
      location,
      tags,
      preferredMode,
      intakeSummary,
      notes,
      consentSigned,
      consentDate,
      status,
    } = req.body;

    const updateData = {
      name,
      email: email?.toLowerCase().trim(),
      phone: phone || "",

      age: age || null,
      dateOfBirth: dateOfBirth || null,

      gender: gender || "",

      occupation: occupation || "",
      location: location || "",

      tags: Array.isArray(tags) ? tags : [],

      preferredMode: preferredMode || "",

      intakeSummary: {
        primaryConcern:
          intakeSummary?.primaryConcern || "",

        medicalHistory:
          intakeSummary?.medicalHistory || "",

        emergencyContact:
          intakeSummary?.emergencyContact || "",
      },

      notes: notes || "",

      consentSigned: consentSigned || false,
      consentDate: consentDate || null,

      status: status || "Active",
    };

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      updateData.password_hash =
        await bcrypt.hash(password, 10);
    }

    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        therapist: req.therapistId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.json({
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Update client error:", error);

    res.status(500).json({
      message: "Failed to update client",
    });
  }
};

// =========================================================
// SET CLIENT PASSWORD
// =========================================================

const setClientPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapistId,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    client.password_hash = await bcrypt.hash(password, 10);

    await client.save();

    res.json({
      message: "Client password set successfully",
    });
  } catch (error) {
    console.error("Set client password error:", error);

    res.status(500).json({
      message: "Failed to set client password",
    });
  }
};

// =========================================================
// DELETE CLIENT
// =========================================================

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      therapist: req.therapistId,
    });

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.json({
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Delete client error:", error);

    res.status(500).json({
      message: "Failed to delete client",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getClients,
  getClientById,
  getMyClient,
  createClient,
  updateClient,
  setClientPassword,
  deleteClient,
};