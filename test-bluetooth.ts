// Ensure that TypeScript recognizes the Web Bluetooth types
/// <reference types="web-bluetooth" />
console.log('hello');
// console.log(navigator);

// class BluetoothDeviceConnector {
//     private device: BluetoothDevice | null = null;
//     private server: BluetoothRemoteGATTServer | null = null;

//     constructor(private deviceName: string) {}

//     // Scan for devices and connect
//     async connect(): Promise<void> {
//         try {
//             console.log('Requesting Bluetooth Device...');
//             this.device = await navigator.bluetooth.requestDevice({
//                 filters: [{ name: this.deviceName }],
//                 optionalServices: ['battery_service']  // Replace with actual service UUIDs
//             });

//             if (!this.device) {
//                 throw new Error('No device found');
//             }

//             console.log('Connecting to the GATT Server...');
//             this.server = await this.device.gatt?.connect();
//             console.log('Connected');
//         } catch (error) {
//             console.error('Connection failed', error);
//         }
//     }

//     // Read data from a specific service and characteristic
//     async readData(serviceUuid: string, characteristicUuid: string): Promise<DataView | null> {
//         if (!this.server) {
//             console.error('GATT Server not connected');
//             return null;
//         }

//         try {
//             const service = await this.server.getPrimaryService(serviceUuid);
//             const characteristic = await service.getCharacteristic(characteristicUuid);
//             const value = await characteristic.readValue();
//             console.log('Read value:', value);
//             return value;
//         } catch (error) {
//             console.error('Failed to read value', error);
//             return null;
//         }
//     }

//     // Disconnect from the device
//     disconnect(): void {
//         if (!this.device?.gatt?.connected) {
//             console.log('Device is not connected');
//             return;
//         }
//         console.log('Disconnecting...');
//         this.device.gatt.disconnect();
//         console.log('Disconnected');
//     }
// }

// // Usage example
// (async () => {
//     const connector = new BluetoothDeviceConnector('LD2410c'); // Replace with actual device name
//     await connector.connect();
//     const data = await connector.readData('battery_service', 'battery_level'); // Replace with actual UUIDs
//     console.log(data?.getUint8(0)); // Example of how to interpret the data
//     connector.disconnect();
// })();
