const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Therapist = require("../models/Therapist");
const Client = require("../models/Client");

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// =========================================================
// REGISTER THERAPIST
// =========================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      bio,
      specializations,
      languages,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingTherapist = await Therapist.findOne({
      email: normalizedEmail,
    });

    if (existingTherapist) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    let slug = generateSlug(name);

    const slugExists = await Therapist.findOne({ slug });

    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const therapist = await Therapist.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      phone: phone || "",
      bio: bio || "",
      specializations: Array.isArray(specializations)
        ? specializations
        : [],
      languages: Array.isArray(languages)
        ? languages
        : [],
      slug,
    });

    const token = jwt.sign(
      {
        therapistId: therapist._id.toString(),
        role: "therapist",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Therapist registered successfully",
      token,
      role: "therapist",
      therapist,
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Failed to register therapist",
    });
  }
};

// =========================================================
// REGISTER CLIENT
// =========================================================

const registerClient = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      therapistSlug,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !therapistSlug
    ) {
      return res.status(400).json({
        message:
          "Name, email, password and therapist branded link are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    const normalizedSlug = therapistSlug
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/^\/+|\/+$/g, "")
      .replace(/^therapist\//i, "")
      .replace(/^\/+|\/+$/g, "");

    // Find therapist from branded link
    const therapist = await Therapist.findOne({
      slug: normalizedSlug,
    });

    if (!therapist) {
      return res.status(404).json({
        message:
          "Therapist branded link not found. Please check the link shared by your therapist.",
      });
    }

    // Check existing client
    const existingClient = await Client.findOne({
      email: normalizedEmail,
    });

    if (existingClient) {
      return res.status(409).json({
        message:
          "A client account with this email already exists.",
      });
    }

    // Hash client password
    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    // Create client
    const client = await Client.create({
      therapist: therapist._id,

      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,

      phone: "",
      age: null,
      dateOfBirth: null,
      gender: "",
      occupation: "",
      location: "",

      tags: [],

      preferredMode: "",

      intakeSummary: {
        primaryConcern: "",
        medicalHistory: "",
        emergencyContact: "",
      },

      notes: "",

      consentSigned: false,
      consentDate: null,

      status: "Active",
    });

    // Remove password hash before sending response
    const clientResponse =
      client.toObject();

    delete clientResponse.password_hash;

    return res.status(201).json({
      message:
        "Client account created successfully",

      client: clientResponse,

      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
        bio: therapist.bio,
        specializations:
          therapist.specializations,
        languages:
          therapist.languages,
      },
    });
  } catch (error) {
    console.error(
      "Register client error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create client account",
    });
  }
};

// =========================================================
// LOGIN
// =========================================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
      role = "therapist",
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // =====================================================
    // THERAPIST LOGIN
    // =====================================================

    if (role === "therapist") {
      const therapist =
        await Therapist.findOne({
          email: normalizedEmail,
        });

      if (!therapist) {
        return res.status(401).json({
          message:
            "Invalid therapist email or password",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          therapist.password_hash
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid therapist email or password",
        });
      }

      const token = jwt.sign(
        {
          therapistId:
            therapist._id.toString(),
          role: "therapist",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        message:
          "Therapist login successful",
        token,
        role: "therapist",
        therapist,
      });
    }

    // =====================================================
    // CLIENT LOGIN
    // =====================================================

    if (role === "client") {
      const client =
        await Client.findOne({
          email: normalizedEmail,
        }).populate(
          "therapist",
          "name email slug bio specializations languages"
        );

      if (!client) {
        return res.status(401).json({
          message:
            "Invalid client email or password",
        });
      }

      if (!client.password_hash) {
        return res.status(403).json({
          message:
            "Client account is not activated yet. Please contact your therapist.",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          client.password_hash
        );

      if (!passwordMatch) {
        return res.status(401).json({
          message:
            "Invalid client email or password",
        });
      }

      const token = jwt.sign(
        {
          clientId:
            client._id.toString(),

          therapistId:
            client.therapist
              ? client.therapist._id.toString()
              : null,

          role: "client",
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      return res.json({
        message:
          "Client login successful",

        token,

        role: "client",

        client,

        therapist:
          client.therapist || null,
      });
    }

    return res.status(400).json({
      message: "Invalid account type",
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message: "Failed to login",
    });
  }
};

// =========================================================
// GET LOGGED-IN THERAPIST
// =========================================================

const getMe = async (req, res) => {
  try {
    const therapist =
      await Therapist.findById(
        req.therapistId
      ).select("-password_hash");

    if (!therapist) {
      return res.status(404).json({
        message: "Therapist not found",
      });
    }

    res.json({
      role: "therapist",
      therapist,
    });
  } catch (error) {
    console.error(
      "Get me error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch account",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  register,
  registerClient,
  login,
  getMe,
};