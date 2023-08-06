import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const DoctorRequestSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.ObjectId, required: true },
    fulfilled: { type: Boolean, default: false },
    doctor_id: { type: mongoose.Schema.ObjectId, ref:"Doctor" },
    doctor_location: pointSchema,
    active: { type: Boolean, default: true },
    notifications: [mongoose.Schema.ObjectId],
  }, { timestamps: true });
  
export const DoctorRequest = mongoose.model("DoctorRequest", DoctorRequestSchema);