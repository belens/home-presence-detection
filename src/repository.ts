import { logger } from "../logger";
import { postSensorData } from "./api";
import { BluetoothEvent, createStore } from "./bluetoothStore";

const devices = ['HLK-LD2410_6F1F', 'HLK-LD2410_2850'];

const openBluetooth = async () => {

  for (const device of devices) {
    console.log('initialize ', device);
    const store = createStore(device, 'FDFCFBFA0800A80048694C696E6B04030201');
    store.connect();
    store.subscribe((e: BluetoothEvent) => {
      if (e.eventType === 'READ') {
        console.log('read', e.device);
        postSensorData(e.payload, e.device);
      } else {
        logger.log(`${e.device} ${e.eventType}`);
      }

    });
  }

}

openBluetooth();