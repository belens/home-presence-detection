// const noble = require('@abandonware/noble');

// noble.on('stateChange', async (state) => {
//   console.log('State changed to', state);
//   if (state === 'poweredOn') {
//     console.log('Scanning...');
//     noble.startScanning();  // No specific service UUIDs, scanning for all devices
//   } else {
//     console.log('Bluetooth is not powered on.');
//     noble.stopScanning();
//   }
// });

// noble.on('discover', (peripheral) => {
//   console.log(`Found device: ${peripheral.advertisement.localName}, ${peripheral.address}`);
// });

// noble.on('discover', (peripheral) => {
//     const name = peripheral.advertisement.localName || '';
//     if (name.includes('HLK-LD2410_6F1F')) {  // Adjust this condition based on your device's actual name
//       console.log(`Attempting to connect to ${name} at ${peripheral.address}`);
//       noble.stopScanning();
  
//       peripheral.connect((error) => {
//         if (error) {
//           console.error('Connection failed:', error);
//           return;
//         }
//         console.log('Connected successfully!');
        
//         // Optionally, discover services and characteristics here
//         peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
//             services[0].characteristics[0].read((error, data) => {
//               console.log('Read data:', data);
//             });
//             services[0].characteristics[0].write( Buffer.from([0xfd, 0xfc, 0xfb, 0xfa, 0x2, 0x0, 0x61, 0x0, 0x4, 0x3, 0x2, 0x1]), true, (error) => {
//               console.error('error:', error);
//             });
                   
//         });
//       });
//     }
// });
// -------------------

// import noble from '@abandonware/noble';

// const targetDeviceName = 'HLK-LD2410_6F1F';  // Device name to connect to
// noble.
// noble.on('stateChange', async (state) => {
//     if (state === 'poweredOn') {
//         console.log('Starting to scan for devices...');
//         noble.startScanning();
//     } else {
//         noble.stopScanning();
//         console.log('Bluetooth is not powered on.');
//     }
// });

// noble.on('discover', async (peripheral) => {
//   console.log(peripheral.advertisement.localName);
//     if (peripheral.advertisement.localName === targetDeviceName) {
//         console.log(`Found device: ${peripheral.advertisement.localName}`);

//         // Stop scanning once we found the device
//         noble.stopScanning();

//         // Connect to the device
//         peripheral.connect((error) => {
//             if (error) {
//                 console.error('Connection error:', error);
//                 return;
//             }

//             console.log('Connected to device');

//             // Optionally discover services and characteristics
//             peripheral.discoverServices([], (error, services) => {
//                 if (error) {
//                     console.error('Service discovery error:', error);
//                     return;
//                 }

//                 services.forEach((service) => {
//                     console.log(`Discovered service: ${service.uuid}`);
//                     service.discoverCharacteristics([], (error, characteristics) => {
//                         if (error) {
//                             console.error('Characteristic discovery error:', error);
//                             return;
//                         }

//                         characteristics.forEach((characteristic) => {
//                             console.log(`Discovered characteristic: ${characteristic.uuid}`);

//                             // Example: Read data from a specific characteristic
//                             if (characteristic.uuid === 'yourCharacteristicUuidHere') {
//                                 characteristic.read((error, data) => {
//                                     if (error) {
//                                         console.error('Read error:', error);
//                                         return;
//                                     }

//                                     console.log('Characteristic data:', data.toString('utf-8'));
//                                 });
//                             }
//                         });
//                     });
//                 });
//             });
//         });
//     }
// });


const noble = require('@abandonware/noble');
// import * as noble from '@abandonware/noble';

// Constants for the device and protocol
const SERVICE_UUIDS = ['AF30', 'FFF0', 'AE00']; // Replace with your actual service UUID
const CHARACTERISTIC_UUIDS = ['FFF1', 'FFF2']; // Replace with your actual characteristic UUID
// const LOGIN_COMMAND = Buffer.from('FDFCFBFA0800A80048694c696e6b486904030201', 'hex'); // Command to enable configuration mode
// 0x4869(Hi) 0x4c69 (Li) 0x6e6b
const LOGIN_COMMAND = 'FDFCFBFA0800A80048694C696E6B04030201'; // Command to enable configuration mode
const READ_DATA_COMMAND = Buffer.from([0xfd, 0xfc, 0xfb, 0xfa, 0x2, 0x0, 0x62, 0x0, 0x4, 0x3, 0x2, 0x1]); // Command to read data
// services[0].characteristics[0].write( Buffer.from([0xfd, 0xfc, 0xfb, 0xfa, 0x2, 0x0, 0x62, 0x0, 0x4, 0x3, 0x2, 0x1]), true, (error) => {
//   //               console.error('error:', error);
//   //             });
noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    console.log('Starting Bluetooth scan...');
    noble.startScanning(SERVICE_UUIDS, false);
  } else {
    console.log('Bluetooth is not powered on.');
    noble.stopScanning();
  }
});

noble.on('discover', (peripheral) => {
  console.log(`Discovered device: ${peripheral.advertisement.localName}`);
  noble.stopScanning();

  peripheral.connect((error) => {
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    console.log(`Connected to ${peripheral.advertisement.localName}`);

    // Discover services and characteristics
    peripheral.discoverAllServicesAndCharacteristics( (err, services, characteristics) => {
      if (err) {
        console.error('Service discovery error:', err);
        return;
      }
      // console.log(characteristics);
      const characteristicff2 = characteristics[0];
      const characteristicff1 = characteristics[1];
      characteristicff1.notify(true)
      console.log(`Characteristic ${characteristicff2.uuid} found. Setting up configurations...`);
     
      characteristicff2.write(hexStringToByteArray(LOGIN_COMMAND), true, (error) => {
        if (error) {
          console.error('Error sending login command:', error);
          return;
        }
        characteristicff2.write(READ_DATA_COMMAND, true, (error) => {

        });
        console.log('login sent. Reading data...');
      
        characteristicff1.on('data',(data, isNotification) => {
          console.log('--- read', isNotification, data.length, data);
    });
      characteristicff1.read();
      
        // characteristicff1.read((err, data) => {
        //   if (err) {
        //     console.log(`Error reading data: ${err}`);
        //   }
        //   console.log('---- .read', isNotification, data.length, data);
        // });
        
          // characteristicff1.read((err, data) => {
          //   console.log('Received ff1:', data.toString('hex'));
          // });
          // setTimeout(() => {
            
          //   characteristicff1.read((err, data) => {
          //     console.log('Received fs1:', data.toString('hex'));
          //   });
          // },3000);
        
        // // After enabling configuration, send read command
        // characteristicff2.write(READ_DATA_COMMAND, true, (error) => {
        //   if (error) {
        //     console.error('Error sending read command:', error);
        //     return;
        //   }
        //   // Handle incoming data
        //   console.log('asdf');
        //   // Subscribe to receive data notifications
          // characteristicff2.subscribe((error) => {
          //   if (error) {
          //     console.error('Subscription error:', error);
          //     return;
          //   }
          //   console.log('Subscribed to data notifications.');
          // });

         
        // });
      });
    });
  });

  peripheral.on('disconnect', () => {
    console.log('Disconnected from device');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Fatal error:', error);
});

function hexStringToByteArray(hexString) {
  if (hexString.length % 2 !== 0) {
      throw new Error("Hex string must have an even number of characters");
  }

  let byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
      byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }

  return byteArray;
}