import { Router } from "express";
import jwt from "jsonwebtoken";
import { DoctorRequest } from "../models/doctor_request.model.js";
import { Patient } from "../models/patient.model.js";
import { Notification } from "../models/notification.schema.js";
import { request_doctor } from "../services/request_doctor.service.js";
import { Doctor } from "../models/doctor.schema.js";

const router = Router();

router.use((req, res, next) => {
    //check for jwt token
    const token = req.headers["authorization"] ? req.headers["authorization"].split(" ")[1] : null
    if (!token) return res.status(401).send("Access Denied");
    jwt.verify(token, process.env.JWT_SECRET_DOCTOR, async (err, decoded) => {
        if (err) return res.status(401).send("Access Denied");
        const user = await Doctor.findOne({ _id: decoded._id });
        if (!user) return res.status(401).send("Access Denied");
        req.user = user;
        next();
    }
    );
});

console.log("sample doctor token: " + jwt.sign({ _id: "64c1837275b2902cc912f763" }, process.env.JWT_SECRET_DOCTOR));

router.get("/", (req, res) => {
    res.send("Hello Doctor");
})

router.get("/requests", async (req, res) => {
    res.send(await Notification.find({ doctor_id: req.user._id }).populate("doctor_request_id"));
})

router.post("/accept_request", async (req, res) => {
    console.log(req.query)
    const { notification_id } = req.query;
    const notification = await Notification.findOne({ _id: notification_id, doctor_id: req.user._id });
    if (!notification) return res.status(400).send("Notification not found");
    console.log(`doctor ${req.user.name}(${req.user._id}) is trying to accept notification ${notification._id}`)
    const doctor_request = await DoctorRequest.findById(notification.doctor_request_id);
    if(doctor_request.fulfilled) return res.status(400).send("Request already fulfilled");
    await DoctorRequest.findByIdAndUpdate(notification.doctor_request_id, {
        fulfilled: true,
        doctor_id: req.user._id
    });
    return res.send(await DoctorRequest.findById(notification.doctor_request_id));
});

router.post("/update_location", async (req, res)=>{
    const {longitude, latitude} = req.query;
    console.log(`doctor ${req.user.name} (${req.user._id}) updated their location`);
    await Doctor.findByIdAndUpdate(req.user._id, {
        live_loc: {
            type: "Point",
            coordinates: [longitude, latitude]
        } 
    })
    return res.status(200).send();
});

export default router;