import mongoose from "mongoose";
// Define the Patient model
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    identityCard: { type: String },
    address: { type: String, required: true },
    otp: { type: String },
    otpExpiration: { type: Date },
});

export const Patient = mongoose.model("Patient", patientSchema);