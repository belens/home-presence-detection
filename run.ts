import { createBluetoothReadStore } from "./src/bluetoothStore";
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
let bluetoothReadStore: SerialStore | null = null;

const openBluetooth = async () => {

    try {
        const device = await (
            navigator as Navigator & { bluetooth: any }
        ).bluetooth.requestDevice({
            filters: [
                {
                    name: "HLK-LD2410_6F1F", // TODO: make this configurable
                },
            ],
            optionalServices: [0xfff0, 0xae00],
        });
        console.log("Connected to ", device.name);
        const server = await device.gatt.connect();

        bluetoothReadStore = createBluetoothReadStore(server);
        await bluetoothReadStore.connect();
        bluetoothReadStore.subscribe(handleNotification);
    } catch (error) {
        console.error("Argh! " + error);
    }
};

const handleNotification = (event: any) => {
    if (event.eventType === "DISCONNECT") {
      // serialReadStore = null; // to avoid the page dissapearing
    }

    console.log(event.eventType, [event.payload]);
  };

openBluetooth();