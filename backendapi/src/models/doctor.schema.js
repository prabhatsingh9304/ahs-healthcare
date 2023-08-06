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
// Create Doctor schema
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    loc: {
        type: pointSchema,
    },  
    live_loc: {
      type: pointSchema,
    },    
    contact: { type: String, required: true },
    regno: { type: String, required: true },

});
doctorSchema.index({ loc: "2dsphere" });
export const Doctor = mongoose.model("Doctor", doctorSchema);

