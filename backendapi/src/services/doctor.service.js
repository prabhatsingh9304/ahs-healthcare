import { Notification } from "../models/notification.schema.js";
import { S2 } from "s2-geometry";
import { Doctor } from "../models/doctor.schema.js";
import { getTravelTimeInSeconds } from "../utils/travel-time-calc.util.js"
import { DoctorRequest } from "../models/doctor_request.model.js";

async function findDoctorsWithinRange(latitude, longitude) {
    const doctors = await Doctor.find({
        loc: {
            $near: {
                $maxDistance: Number(process.env.SEARCH_RADIUS_IN_KM) * 1000,
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            }
        }
    });
    return doctors;

}

async function send_notification(doctor, doctor_request_id) {
    console.log({doctor})
    return await new Notification({
        doctor_request_id,
        doctor_id: doctor._id
    }).save();
}


// A doctor batch is an array of doctors. This function returns an array of batches. The first batch contains the doctors closest to the patient. The second batch contains the next closest doctors and so on.
export async function getDoctorBatches(patient) {
    try {
        const doctors_in_range = await findDoctorsWithinRange(patient.latitude, patient.longitude);
        const doctor_etas = await Promise.all(
            doctors_in_range.map(async (doctor) => getTravelTimeInSeconds(
                {lat: doctor.loc.coordinates[1], lng: doctor.loc.coordinates[0]},
                {lat: Number(patient.latitude), lng: Number(patient.longitude)}
            )
            )
        );
        const doctors_with_eta = doctors_in_range.map((doctor, index) => {
            return {
                ...JSON.parse(JSON.stringify(doctor)),
                eta: doctor_etas[index]
            }
        });

        const doctors_sorted_by_eta = doctors_with_eta.sort((a, b) => a.eta - b.eta);

        let doctor_batches = [];
        let current_batch = [];

        doctors_sorted_by_eta.forEach((doctor) => {
            if (current_batch.length.toString() === process.env.DOCTOR_BATCH_SIZE) {
                doctor_batches.push(current_batch);
                current_batch = [];
            }
            current_batch.push(doctor);
        })
        doctor_batches.push(current_batch);
        return doctor_batches;
    } catch (e) {
        throw e;
    }
}

export async function notify_doctor(doctor_request, doctor, patient) {
    console.log(`notifying doctor ${doctor.name}(${doctor._id}) for doctor request by ${patient.name}`)
    try {
        const {_id} = send_notification(doctor, doctor_request._id);
        // doctor_request.notifications.push(_id);
        // await DoctorRequest(doctor_request).save();
    } catch (e) {
        throw e;
    }
}