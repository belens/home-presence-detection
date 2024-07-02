import { decodeByteArrayToData } from "./lib/ld2410/decode";

import noble from '@abandonware/noble';
import { logger } from './logger'

// Constants for the device and protocol
const SERVICE_UUIDS = ['AF30', 'FFF0', 'AE00']; // Replace with your actual service UUID
const CHARACTERISTIC_UUIDS = ['FFF1', 'FFF2']; // Replace with your actual characteristic UUID

const LOGIN_COMMAND = 'FDFCFBFA0800A80048694C696E6B04030201'; // Command to enable configuration mode
const READ_DATA_COMMAND = Buffer.from([0xfd, 0xfc, 0xfb, 0xfa, 0x2, 0x0, 0x62, 0x0, 0x4, 0x3, 0x2, 0x1]); // Command to 

noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    logger.debug('Starting Bluetooth scan...');
    noble.startScanning(SERVICE_UUIDS, false);
  } else {
    logger.debug('Bluetooth is not powered on.');
    noble.stopScanning();
  }
});

noble.on('discover', (peripheral) => {
  logger.debug(`Discovered ${JSON.stringify(peripheral.advertisement)}`);
  if (peripheral.advertisement.localName === 'HLK-LD2410_6F1F') {
    peripheral.connect((error) => {
      if (error) {
        console.error('Connection error:', error);
        return;
      }
      handleConnectedPeripheral(peripheral);
    });
  }

  peripheral.on('disconnect', () => {
    logger.debug('Disconnected from device');
    process.exit(0);
  });
});

function handleConnectedPeripheral(peripheral) {

  logger.debug(`Connected to ${peripheral.advertisement.localName}`);
  peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => { // TODO: check if we can remove this discovery, since we already know the UUIDs
    if (error) {
      console.error('Service discovery error:', error);
      return;
    }
    const loginCharacteristic = characteristics[0]; // FF2
    const readCharacteristic = characteristics[1]; // FF1
    readCharacteristic.notify(true);

    logger.debug(`Characteristic ${loginCharacteristic.uuid} found. Setting up configurations...`);

    loginCharacteristic.write(hexStringToByteArray(LOGIN_COMMAND), true, (error) => {
      if (error) {
        console.error('Error sending login command:', error);
        return;
      }
      logger.debug('Login sent.');
      
      readCharacteristic.on('data', (data: Uint8Array, isNotification) => {
        const readResponse = decodeByteArrayToData(data);
        logger.debug(readResponse.targetStatus);
      });

      logger.debug('Reading data...');
      readCharacteristic.read();
    });
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Fatal error:', error);
});

function hexStringToByteArray(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }

  let byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }

  return byteArray;
}