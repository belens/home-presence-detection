import { request } from 'http';
import { RadarDataOutputBasicPayload } from '../lib/ld2410/types';

let lastCallTime = {
    'HLK-LD2410_2850': 0,
    'HLK-LD2410_6F1F': 0
};
const DEBOUNCE_TIME = 500;

export function postSensorData(sensorData: RadarDataOutputBasicPayload, room: string) {
    const data = JSON.stringify({
        status: sensorData.targetStatus,
        timestamp: new Date().toISOString(),
        room: room
    });
    // console.log('Posting sensor data:', room, data);
    
    const now = Date.now();
    if (now - lastCallTime[room] < DEBOUNCE_TIME) {
        return;
    }

    lastCallTime[room] = now;
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/sensor-data',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            const response = JSON.parse(responseData);
            console.log('Response:', response.timestamp, response.room, response.status);
        });
    });

    req.on('error', (error) => {
        console.error('Error:', error);
    });

    req.write(data);
    req.end();
}