var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Ensure that TypeScript recognizes the Web Bluetooth types
/// <reference types="web-bluetooth" />
console.log('hello');
var BluetoothDeviceConnector = /** @class */ (function () {
    function BluetoothDeviceConnector(deviceName) {
        this.deviceName = deviceName;
        this.device = null;
        this.server = null;
    }
    // Scan for devices and connect
    BluetoothDeviceConnector.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        console.log('Requesting Bluetooth Device...');
                        _a = this;
                        return [4 /*yield*/, navigator.bluetooth.requestDevice({
                                filters: [{ name: this.deviceName }],
                                optionalServices: ['battery_service'] // Replace with actual service UUIDs
                            })];
                    case 1:
                        _a.device = _d.sent();
                        if (!this.device) {
                            throw new Error('No device found');
                        }
                        console.log('Connecting to the GATT Server...');
                        _b = this;
                        return [4 /*yield*/, ((_c = this.device.gatt) === null || _c === void 0 ? void 0 : _c.connect())];
                    case 2:
                        _b.server = _d.sent();
                        console.log('Connected');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _d.sent();
                        console.error('Connection failed', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Read data from a specific service and characteristic
    BluetoothDeviceConnector.prototype.readData = function (serviceUuid, characteristicUuid) {
        return __awaiter(this, void 0, void 0, function () {
            var service, characteristic, value, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.server) {
                            console.error('GATT Server not connected');
                            return [2 /*return*/, null];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.server.getPrimaryService(serviceUuid)];
                    case 2:
                        service = _a.sent();
                        return [4 /*yield*/, service.getCharacteristic(characteristicUuid)];
                    case 3:
                        characteristic = _a.sent();
                        return [4 /*yield*/, characteristic.readValue()];
                    case 4:
                        value = _a.sent();
                        console.log('Read value:', value);
                        return [2 /*return*/, value];
                    case 5:
                        error_2 = _a.sent();
                        console.error('Failed to read value', error_2);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Disconnect from the device
    BluetoothDeviceConnector.prototype.disconnect = function () {
        var _a, _b;
        if (!((_b = (_a = this.device) === null || _a === void 0 ? void 0 : _a.gatt) === null || _b === void 0 ? void 0 : _b.connected)) {
            console.log('Device is not connected');
            return;
        }
        console.log('Disconnecting...');
        this.device.gatt.disconnect();
        console.log('Disconnected');
    };
    return BluetoothDeviceConnector;
}());
// Usage example
(function () { return __awaiter(_this, void 0, void 0, function () {
    var connector, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                connector = new BluetoothDeviceConnector('LD2410c');
                return [4 /*yield*/, connector.connect()];
            case 1:
                _a.sent();
                return [4 /*yield*/, connector.readData('battery_service', 'battery_level')];
            case 2:
                data = _a.sent();
                console.log(data === null || data === void 0 ? void 0 : data.getUint8(0)); // Example of how to interpret the data
                connector.disconnect();
                return [2 /*return*/];
        }
    });
}); })();
