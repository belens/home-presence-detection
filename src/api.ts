import { request } from 'http';
import { RadarDataOutputBasicPayload } from '../lib/ld2410/types';

export function postSensorData(sensorData: RadarDataOutputBasicPayload, room: string) {
    const data = JSON.stringify({
        status: sensorData.targetStatus,
        timestamp: new Date().toISOString(),
        room: room
    });

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
            console.log('Response:', responseData);
        });
    });

    req.on('error', (error) => {
        console.error('Error:', error);
    });

    req.write(data);
    req.end();
}