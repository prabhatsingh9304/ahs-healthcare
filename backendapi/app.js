import {connect_to_database} from './src/services/database.service.js';
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import patientRouter from './src/routes/patient.js';
import doctorRouter from './src/routes/doctor.js';
dotenv.config();

connect_to_database();

// Create Express server
const app = express();
const port = process.env.PORT || 3000;

// Express configuration
app.use('/patient', patientRouter);
app.use('/doctor', doctorRouter);

// const token = jwt.sign(
//     { _id: "64c16a66ae9c4aa177bcfc3b" },
//     "your-secret-key"
//   );
// console.info("test patient token", token);



app.listen(port, () => console.log(`Server started on port ${port}`));