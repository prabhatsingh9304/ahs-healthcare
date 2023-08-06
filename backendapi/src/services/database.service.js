import mongoose from "mongoose";
import { Doctor } from "../models/doctor.schema.js";
import { Patient } from "../models/patient.model.js";
import { S2 } from "s2-geometry";
import dotenv from "dotenv";
dotenv.config();

export async function connect_to_database() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
        //create a doctor with name Dr at SDA at location 28.5473058,77.1835511


        // const newDoctor = await new Doctor({
        //     name: "Dr. At Chayoos",
        //     loc: {
        //         type: "Point",
        //         coordinates: [77.1835511, 28.5473058]
        //     },
        //     address: "Delhi",
        //     contact: "1234567891",
        //     regno: "1234567890",
        // }).save();

        // console.log(newDoctor);
    } catch (error) {
        console.log(error);
    }
}
