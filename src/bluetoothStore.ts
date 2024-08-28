import { decodeByteArrayToData } from "../lib/ld2410/decode";
import noble, { Peripheral } from '@abandonware/noble';
import { logger } from '../logger';
import { postSensorData } from "./api";
import { RadarDataOutputBasicPayload } from "../lib/ld2410/types";

const SERVICE_UUIDS = ['AF30', 'FFF0', 'AE00'];
const CHARACTERISTIC_UUIDS = ['FFF1', 'FFF2'];

type ReadResult =
  | { value: Uint8Array; done: false }
  | { value: undefined; done: true };

interface ReadEvent {
  eventType: "READ";
  payload: RadarDataOutputBasicPayload;
  device: string;
}

interface WriteEvent {
  eventType: "WRITE";
  payload: Uint8Array;
  device: string;
}

interface ConnectEvent {
  eventType: "CONNECT";
  device: string;
}

interface SubscribedEvent {
  eventType: "SUBSCRIBED";
  device: string;
}

interface DisconnectEvent {
  eventType: "DISCONNECT";
  device: string;
}

export type BluetoothEvent =
  | ReadEvent
  | WriteEvent
  | ConnectEvent
  | DisconnectEvent
  | SubscribedEvent;

type SubscribeCallback = (value: BluetoothEvent) => void;

interface Store {
  subscribe: (subscription: SubscribeCallback) => () => void;
}

export type BluetoothStore = Store & {
  connect: () => Promise<void>;
  disconnect: () => void;
  write: (payload: Uint8Array) => void;
  id: string;
  subs: SubscribeCallback[]
};

export const createStore = (id: string, pw: string): BluetoothStore => {
  let stopping = false;
  let loginCharacteristic: noble.Characteristic | null = null;
  let readDataCharacteristic: noble.Characteristic | null = null;
  let peripheral: noble.Peripheral | null = null;
  const subs: SubscribeCallback[] = [];
  const writeQueue: Uint8Array[] = [];

  const broadcastEvent = (e: BluetoothEvent) => subs.forEach((cb) => cb(e));

  const readForever = async () => {
    if (!readDataCharacteristic) { return }
    readDataCharacteristic.on('data', (data: Uint8Array, isNotification) => {
      const readResponse = decodeByteArrayToData(data);

      if (readResponse.type === 'RADAR_DATA_OUTPUT') {
        broadcastEvent({
          eventType: "READ",
          payload: readResponse,
          device: id,
        });
      }
    });

    logger.debug('Reading data.');
    readDataCharacteristic.read();

  };

  const login = async () => {
    try {
      await loginCharacteristic.writeAsync(hexStringToByteArray(pw), true);
      logger.debug('Sent Login.');
    } catch (error) {
      logger.error('Error sending login command:' + error);
    }
  };

  const connect = async () => {
    
    await new Promise<void>((resolve, reject) => {
      noble.on('stateChange', (state) => {
        if (state === 'poweredOn') {
          logger.debug('Start scanning.');
          noble.startScanningAsync(SERVICE_UUIDS, false);
        } else {
          logger.error('Bluetooth is not powered on.', state);
          noble.stopScanning();
        }
      });

      noble.on('discover', async (p) => {
        peripheral = p;
        logger.debug(`Discovered ${JSON.stringify(peripheral.advertisement.localName)}`);
        
        if (peripheral.advertisement.localName === id) {
          try {
            await peripheral.connectAsync();
            logger.log(`Connected to ${peripheral.advertisement.localName}`);
            const { characteristics } = await peripheral.discoverAllServicesAndCharacteristicsAsync();
            loginCharacteristic = characteristics[0]; // FF2
            readDataCharacteristic = characteristics[1]; // FF1
            readDataCharacteristic.notify(true);


            peripheral.on('disconnect', () => {
              logger.debug('Disconnected from device');
              broadcastEvent({
                eventType: "DISCONNECT",
                device: id,
              });
            });

            logger.debug(`Characteristic ${loginCharacteristic.uuid} found. Setting up configurations...`);
            resolve();
          } catch (error) {
            reject('Connection error: ' + error);
            return;
          }
        }
      });
    });

    login(); // Bluetooth require login
    readForever();
    // writeForever();
    broadcastEvent({
      eventType: "CONNECT",
      device: id,
    });
  };

  const disconnect = async () => {
    stopping = true;
    peripheral.disconnect(); // TODO: refactor
  };

  const write = async (payload: Uint8Array) => {
    // writeQueue.push(payload);
  };

  const writeForever = async () => {
    // while (!stopping) {
    //   if (writeQueue.length > 0) {

    //     const payload = writeQueue.shift();
    //     loginCharacteristic.writeValue(payload)

    //     broadcastEvent({ eventType: "WRITE", payload });
    //   }
    //   await new Promise((x) => setTimeout(x, 100));
    // }
  };

  function hexStringToByteArray(hexString: string): Uint8Array {
    if (hexString.length % 2 !== 0) {
      throw new Error("Hex string must have an even number of characters");
    }

    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }

    return byteArray;
  }

  const subscribe = (cb: SubscribeCallback) => {
    subs.push(cb);
    cb({
      eventType: "SUBSCRIBED",
      device: id,
    });

    return () => {
      const index = subs.findIndex((fn) => fn === cb);
      subs.splice(index, 1);
    };
  };

  return { connect, write, disconnect, subscribe, id, subs };
};
