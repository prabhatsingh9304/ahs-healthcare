import { Router } from "express";
import jwt from "jsonwebtoken";
import {DoctorRequest} from "../models/doctor_request.model.js";
import { Patient } from "../models/patient.model.js";
import { request_doctor } from "../services/request_doctor.service.js";

const router = Router();

router.use((req, res, next) => {
    //check for jwt token
    const token = req.headers["authorization"] ? req.headers["authorization"].split(" ")[1] : null
    if (!token) return res.status(401).send("Access Denied");
    jwt.verify(token, process.env.JWT_SECRET_PATIENT, async (err, decoded) => {
        if (err) return res.status(401).send("Access Denied");
        const user = await Patient.findOne({_id: decoded._id});
        if (!user) return res.status(401).send("Access Denied");
        req.user = user;
        next();
    }
    );
});

console.log("sample patient token: "+ jwt.sign({_id: "64c16a66ae9c4aa177bcfc3b"}, process.env.JWT_SECRET_PATIENT));

router.get("/", (req, res) => {
    res.send("Hello Patient");
})

router.get("/request_doctor", async (req, res) => {
    const {latitude, longitude} = req.query;
    res.send(await request_doctor(req.user, {latitude, longitude}));
})

router.get("/request_details", async (req, res) => {
    res.send(await DoctorRequest.findOne({
        patient_id: req.user._id,
        _id: req.query.doctor_request_id
    }).populate("doctor_id"));
})

export default router;