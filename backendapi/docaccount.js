// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

// Set up Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose
  .connect("mongodb://localhost/doctors", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define the Doctor model
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  contactNo: { type: String, required: true },
  regNo: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiration: { type: Date },
  isVerified: Boolean,
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// Doctor signup
app.post("/docaccount/signup", async (req, res) => {
  const { name, email, username, password, address, contactNo, regNo } =
    req.body;
  // Validate the presence of all required fields
  if (
    !name ||
    !email ||
    !username ||
    !password ||
    !address ||
    !contactNo ||
    !regNo
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if doctor already exists
  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    return res.status(400).json({ error: "Doctor already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new doctor
  const doctor = new Doctor({
    name,
    username,
    email,
    password: hashedPassword,
    address,
    contactNo,
    regNo,
    isVerified: false,
    otp: { type: String, required: true },
    otpExpiration: { type: Date, required: true },
  });

  await doctor.save();

  res.json({ message: "Doctor created successfully" });
});

// Doctor login
app.post("/docaccount/login", async (req, res) => {
  const { email, password } = req.body;

  // Find the doctor
  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, doctor.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create and send the JWT token
  const token = jwt.sign(
    { email: doctor.email, _id: doctor._id },
    "your-secret-key"
  );
  res.json({ token });
});

// Forgot password
app.post("/docaccount/forgot-password", async (req, res) => {
  const { email } = req.body;

  // Find the doctor
  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  // Set OTP and expiration
  doctor.otp = otp;
  doctor.otpExpiration = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
  await doctor.save();

  // Send OTP to the doctor's email
  //Need Implementation

  res.json({ message: "OTP sent successfully" });
});

// Verify OTP and reset password
app.post("/docaccount/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Find the doctor
  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  // Check if OTP is valid and not expired
  if (doctor.otp !== otp || doctor.otpExpiration < Date.now()) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the password and clear OTP fields
  doctor.password = hashedPassword;
  doctor.otp = undefined;
  doctor.otpExpiration = undefined;
  await doctor.save();

  res.json({ message: "Password reset successfully" });
});

// Request OTP for doctor verification
app.post("/doctors/verify", async (req, res) => {
  const { regno } = req.body;

  try {
    // Generate OTP
    const otp = generateOTP(); // Implement your own OTP generation logic

    // Set OTP expiration time (e.g., 5 minutes from now)
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

    // Save OTP and expiration in doctor's account
    await Doctor.findOneAndUpdate(
      { regno },
      { otp, otpExpiration },
      { new: true }
    );

    // Send OTP to doctor via email or SMS
    // Implement Needed

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP." });
  }
});

// Verify doctor account with OTP
app.post("/doctors/verify/:regno", async (req, res) => {
  const { regno } = req.params;
  const { otp } = req.body;

  try {
    const doctor = await Doctor.findOne({ regno });

    if (!doctor) {
      res.status(404).json({ error: "Doctor not found." });
      return;
    }

    if (doctor.isVerified) {
      res.status(400).json({ error: "Doctor account is already verified." });
      return;
    }

    if (doctor.otp !== otp || doctor.otpExpiration < new Date()) {
      res.status(400).json({ error: "Invalid or expired OTP." });
      return;
    }

    // Update doctor account as verified
    doctor.isVerified = true;
    await doctor.save();

    res.status(200).json({ message: "Doctor account verified successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify doctor account." });
  }
});

function generateOTP() {
  const min = 1000; // Minimum value (inclusive)
  const max = 9999; // Maximum value (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get("/docaccount/protected", (req, res) => {
  // Verify the JWT token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Access the doctor's email and ID
    const { email, _id } = decoded;
    res.json({ email, _id });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
