const express = require('express');
const mongoose = require('mongoose');
const S2 = require('s2-geometry').S2;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/doctordb', {
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

const Doctor = mongoose.model('Doctor', doctorSchema);

// Fetch doctors within a range of 2km from patient's coordinates
app.get('/doctors/:latitude/:longitude', async (req, res) => {
  const { latitude, longitude } = req.params;

  try {
    // Create S2 cell ID for the patient's location
    const patientCellId = S2.latLngToKey(latitude, longitude, 15); // Precision level 15

    // Get neighboring cells within a radius of 2km
    const cellIds = S2.getNeighbors(patientCellId, 2); // 2km radius

    // Find doctors matching the neighboring cells
    const doctors = await Doctor.find({ s2cellId: { $in: cellIds } });

    // Extract only the regno values from the doctors
    const regnos = doctors.map((doctor) => doctor.regno);

    res.status(200).json(regnos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors.' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
