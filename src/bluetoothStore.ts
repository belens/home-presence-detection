// import { everyEqual } from "$lib/array/everyEqual";
// import {
//   configurationPayloadTrailer,
//   radarDataOutputPayloadTrailer,
// } from "$lib/ld2410/constants";

type ReadResult =
  | { value: Uint8Array; done: false }
  | { value: undefined; done: true };

interface ReadEvent {
  eventType: "READ";
  payload: Uint8Array;
}

interface WriteEvent {
  eventType: "WRITE";
  payload: Uint8Array;
}

interface ConnectEvent {
  eventType: "CONNECT";
}

interface SubscribedEvent {
  eventType: "SUBSCRIBED";
}

interface DisconnectEvent {
  eventType: "DISCONNECT";
}

type SerialEvent =
  | ReadEvent
  | WriteEvent
  | ConnectEvent
  | DisconnectEvent
  | SubscribedEvent;

type SubscribeCallback = (value: SerialEvent) => void;

interface Store {
  subscribe: (subscription: SubscribeCallback) => () => void;
}

export type SerialStore = Store & {
  connect: () => void;
  disconnect: () => void;
  write: (payload: Uint8Array) => void;
};

export const createBluetoothReadStore = (
  server: any
): SerialStore => {
  let stopping = false;
  let sendPassCharacteristic: any | null = null;
  let readDataCharacteristic: any | null = null;
  const subs: SubscribeCallback[] = [];
  const writeQueue: Uint8Array[] = [];

  const broadcastEvent = (e: SerialEvent) => subs.forEach((cb) => cb(e));

  const write = async (payload: Uint8Array) => {
    writeQueue.push(payload);
  };

  const writeForever = async () => {
    while (!stopping) {
      if (writeQueue.length > 0) {

        const payload = writeQueue.shift();
        sendPassCharacteristic.writeValue(payload)

        broadcastEvent({ eventType: "WRITE", payload });
      }
      await new Promise((x) => setTimeout(x, 100));
    }
  };

  const readForever = async () => {
    if (!readDataCharacteristic) { return }
    await readDataCharacteristic.startNotifications();
    readDataCharacteristic.addEventListener(
      "characteristicvaluechanged",
      (event: any) => {
        broadcastEvent({
          eventType: "READ",
          payload: new Uint8Array(event.target.value.buffer),
        });
      }
    );
  };
  const login = async () => {
    // this is hex version of the login command with the default password
    const hexString = "FDFCFBFA0800A80048694C696E6B04030201"; 
    const byteArray = hexStringToByteArray(hexString);

    sendPassCharacteristic.writeValue(byteArray);

  };
  const connect = async () => {
    const service = await server.getPrimaryService(0xfff0);
    sendPassCharacteristic = await service.getCharacteristic(0xfff2);
    readDataCharacteristic = await service.getCharacteristic(0xfff1);
    
    login(); // Bluetooth require login
    readForever();
    writeForever();
    broadcastEvent({
      eventType: "CONNECT",
    });
  };

  const disconnect = async () => {
    stopping = true;
    server.disconnect(); // TODO: refactor
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
    });

    return () => {
      const index = subs.findIndex((fn) => fn === cb);
      subs.splice(index, 1);
    };
  };

  return { connect, write, disconnect, subscribe };
};
