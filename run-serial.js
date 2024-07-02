const {SerialPort} = require('serialport');

// List all available serial ports
// SerialPort.list().then(ports => {
//     ports.forEach(port => {
//         console.log(`${port.path} - ${port.manufacturer || 'No manufacturer'} - ${port.serialNumber || 'No serial number'}`);
//     });

//     if (ports.length === 0) {
//         console.log('No ports discovered');
//     }
// }).catch(err => {
//     console.error('Error listing ports', err);
// });


// Configure the serial port
const port = new SerialPort({ path: '/dev/tty.usbserial-110', baudRate: 256000 });

function parseSensorData(buffer) {
    console.log(buffer);
  // Extract header, length, command, data, and checksum
  // Use documentation to parse specific data based on command
}

function sendCommand(command) {
  // Send command frame over serial port
  port.write(command);
}

// Listen for data from the sensor
port.on('data', (data) => {
  parseSensorData(data);
});
// port.on('readable', function () {
//     console.log('Data:', port.read())
//   })
// Example command to enable configuration mode
// const enableConfigCommand = Buffer.from([0xfd, 0xfc, 0xfb, 0xfa, 0x2, 0x0, 0x61, 0x0, 0x4, 0x3, 0x2, 0x1]);
// sendCommand(enableConfigCommand);