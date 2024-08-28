import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { RadarDataOutputTargetStatus } from '../lib/ld2410/types';

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/sensordb');

const sensorSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: RadarDataOutputTargetStatus,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    room: {
        type: String,
        required: true
    }
});

const SensorData = mongoose.model('SensorData', sensorSchema);

// Endpoint to receive sensor data
app.post('/sensor-data', async (req, res) => {
    const { status, timestamp, room } = req.body;
    
    const sensorData = new SensorData({
        status,
        timestamp,
        room
    });

    try {
        await sensorData.save();
        res.status(201).send(sensorData);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
