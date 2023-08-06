import { getDoctorBatches, notify_doctor } from "./doctor.service.js";
import { DoctorRequest } from "../models/doctor_request.model.js";
export async function request_doctor(patient, location) {
  try {
    const doctor_request = await new DoctorRequest({
      patient_id: patient._id,
      notifications: [],
    }).save();
    const batches = await getDoctorBatches({ ...patient, ...location });
    console.log({ batches: JSON.stringify(batches) });
    batches.forEach((batch, i) => {
      setTimeout(() => {
        batch.forEach((doctor) => {
          console.log("Notifying doctor: "+doctor.name);
          notify_doctor(doctor_request, doctor, patient);
        });
      }, Number(process.env.DOCTOR_BATCH_EXPIRY_IN_MINS) * 60 * 1000 * i);
    });
    return doctor_request;
  } catch (e) {
    throw e;
  }
}
