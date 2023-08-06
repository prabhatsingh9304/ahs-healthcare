import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    doctor_request_id: { type: mongoose.Schema.ObjectId, required: true, ref:"DoctorRequest" },
    doctor_id: { type: mongoose.Schema.ObjectId },
  }, { timestamps: true });
  
  export const Notification = mongoose.model("Notification", NotificationSchema);