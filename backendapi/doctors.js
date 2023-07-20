const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const bodyParser = require("body-parser");
const S2 = require("s2-geometry").S2;

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/doctordb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Doctor schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  regno: { type: String, required: true },
  s2cellId: { type: String, required: true },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

// Create a new doctor
app.post("/doctors", async (req, res) => {
  const { name, address, contact, regno } = req.body;

  try {
    // Fetch geolocation
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    // Store the latitude and longitude in the 'response' variable
    const response = { latitude, longitude };

    const { lat, lng } = response;

    // Create S2 cell ID for the doctor's location
    const s2cellId = S2.latLngToKey(lat, lng, 15); // Precision level 15

    const newDoctor = new Doctor({
      name,
      latitude: lat,
      longitude: lng,
      address,
      contact,
      regno,
      s2cellId,
    });

    newDoctor.save((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to save the doctor." });
      } else {
        res.status(201).json(newDoctor);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch geolocation." });
  }
});

// Update latitude and longitude of a doctor
app.patch("/doctors/:regno", async (req, res) => {
  const { regno } = req.params;
  try {
    // Fetch geolocation
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;

    // Store the latitude and longitude in the 'response' variable
    const response = { latitude, longitude };

    const { lat, lng } = response;

    // Create S2 cell ID for the doctor's location
    const s2cellIdUpdated = S2.latLngToKey(lat, lng, 15); // Precision level 15
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { regno },
      { latitude: lat, longitude: lng },
      { s2cellId: s2cellIdUpdated },
      { new: true }
    );

    if (updatedDoctor) {
      res.status(200).json(updatedDoctor);
    } else {
      res.status(404).json({ error: "Doctor not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the doctor location." });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
