// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const otpGenerator = require("otp-generator");

// Set up Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb://localhost/patients", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

import { Patient } from "./src/utils/models/patient.model.js";

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext);
  },
});

const upload = multer({ storage });

// Patient sign-up
app.post(
  "/api/patient/signup",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "identityCard", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, username, email, password, address } = req.body;
    const profilePic = req.files["profilePic"]
      ? req.files["profilePic"][0].filename
      : "";
    const identityCard = req.files["identityCard"]
      ? req.files["identityCard"][0].filename
      : "";

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });

    // Create a new patient
    const patient = new Patient({
      name,
      username,
      email,
      password,
      profilePic,
      identityCard,
      address,
      otp,
      otpExpiration: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
    });
    await patient.save();

    // Send OTP to the patient's email
    //Need Implementation

    res.json({ message: "Patient signed up successfully" });
  }
);

// Verify OTP and login
app.post("/api/patient/login", async (req, res) => {
  const { email, otp } = req.body;

  // Find the patient
  const patient = await Patient.findOne({ email });
  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  // Check if OTP is valid and not expired
  if (patient.otp !== otp || patient.otpExpiration < Date.now()) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // Clear OTP fields
  patient.otp = undefined;
  patient.otpExpiration = undefined;
  await patient.save();

  // Create and send the JWT token
  const token = jwt.sign(
    { _id: patient._id },
    "your-secret-key"
  );
  res.json({ token });
});

// Protected route example
app.get("/api/patient/profile", (req, res) => {
  // Verify the JWT token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Access the patient's email and ID
    const { email, _id } = decoded;
    res.json({ email, _id });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
