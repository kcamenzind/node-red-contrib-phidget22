import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type TemperatureSensorNodeExtraConfig = {
  dataInterval: number;
  temperatureChangeTrigger: number;
  RTDWireSetup: phidget22.RTDWireSetup;
  RTDType: phidget22.RTDType;
  thermocoupleType: phidget22.ThermocoupleType;
};
type TemperatureSensorNodeConfig = nodeRED.NodeDef &
  PhidgetNodeConfig &
  TemperatureSensorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22TemperatureSensorNode(this: nodeRED.Node, config: TemperatureSensorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const temperatureSensor = new phidget22.TemperatureSensor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    temperatureSensor.onAttach = () => {
      invokeMethod(
        () => temperatureSensor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => temperatureSensor.setTemperatureChangeTrigger(config.temperatureChangeTrigger),
        'setTemperatureChangeTrigger (in onAttach)',
      );
      invokeMethod(() => temperatureSensor.setRTDType(config.RTDType), 'setRTDType (in onAttach)');
      invokeMethod(
        () => temperatureSensor.setRTDWireSetup(config.RTDWireSetup),
        'setRTDWireSetup (in onAttach)',
      );
      invokeMethod(
        () => temperatureSensor.setThermocoupleType(config.thermocoupleType),
        'setThermocoupleType (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    temperatureSensor.onTemperatureChange = (temperature) => {
      const msg = {
        topic: 'TemperatureChange',
        payload: { temperature },
      };
      node.send(msg);
    };

    setupPhidgetDevice(temperatureSensor, node, config);
    openPhidgetDevice(temperatureSensor, 'TemperatureSensor', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'getDataInterval': {
          const DataInterval = invokeMethod(
            () => temperatureSensor.getDataInterval(),
            'getDataInterval',
          );
          msg.payload = { DataInterval };
          node.send(msg);
          break;
        }
        case 'setDataInterval': {
          invokeMethod(
            () => temperatureSensor.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'getMinDataInterval': {
          const MinDataInterval = invokeMethod(
            () => temperatureSensor.getMinDataInterval(),
            'getMinDataInterval',
          );
          msg.payload = { MinDataInterval };
          node.send(msg);
          break;
        }
        case 'getMaxDataInterval': {
          const MaxDataInterval = invokeMethod(
            () => temperatureSensor.getMaxDataInterval(),
            'getMaxDataInterval',
          );
          msg.payload = { MaxDataInterval };
          node.send(msg);
          break;
        }
        case 'getRTDType': {
          const RTDType = invokeMethod(() => temperatureSensor.getRTDType(), 'getRTDType');
          msg.payload = { RTDType };
          node.send(msg);
          break;
        }
        case 'setRTDType': {
          invokeMethod(() => temperatureSensor.setRTDType(msg.payload?.RTDType), 'setRTDType');
          break;
        }
        case 'getRTDWireSetup': {
          const RTDWireSetup = invokeMethod(
            () => temperatureSensor.getRTDWireSetup(),
            'getRTDWireSetup',
          );
          msg.payload = { RTDWireSetup };
          node.send(msg);
          break;
        }
        case 'setRTDWireSetup': {
          invokeMethod(
            () => temperatureSensor.setRTDWireSetup(msg.payload?.RTDWireSetup),
            'setRTDWireSetup',
          );
          break;
        }
        case 'getTemperature': {
          const Temperature = invokeMethod(
            () => temperatureSensor.getTemperature(),
            'getTemperature',
          );
          msg.payload = { Temperature };
          node.send(msg);
          break;
        }
        case 'getMinTemperature': {
          const MinTemperature = invokeMethod(
            () => temperatureSensor.getMinTemperature(),
            'getMinTemperature',
          );
          msg.payload = { MinTemperature };
          node.send(msg);
          break;
        }
        case 'getMaxTemperature': {
          const MaxTemperature = invokeMethod(
            () => temperatureSensor.getMaxTemperature(),
            'getMaxTemperature',
          );
          msg.payload = { MaxTemperature };
          node.send(msg);
          break;
        }
        case 'getTemperatureChangeTrigger': {
          const TemperatureChangeTrigger = invokeMethod(
            () => temperatureSensor.getTemperatureChangeTrigger(),
            'getTemperatureChangeTrigger',
          );
          msg.payload = { TemperatureChangeTrigger };
          node.send(msg);
          break;
        }
        case 'setTemperatureChangeTrigger': {
          invokeMethod(
            () =>
              temperatureSensor.setTemperatureChangeTrigger(msg.payload?.temperatureChangeTrigger),
            'setTemperatureChangeTrigger',
          );
          break;
        }
        case 'getMinTemperatureChangeTrigger': {
          const MinTemperatureChangeTrigger = invokeMethod(
            () => temperatureSensor.getMinTemperatureChangeTrigger(),
            'getMinTemperatureChangeTrigger',
          );
          msg.payload = { MinTemperatureChangeTrigger };
          node.send(msg);
          break;
        }
        case 'getMaxTemperatureChangeTrigger': {
          const MaxTemperatureChangeTrigger = invokeMethod(
            () => temperatureSensor.getMaxTemperatureChangeTrigger(),
            'getMaxTemperatureChangeTrigger',
          );
          msg.payload = { MaxTemperatureChangeTrigger };
          node.send(msg);
          break;
        }
        case 'getThermocoupleType': {
          const ThermocoupleType = invokeMethod(
            () => temperatureSensor.getThermocoupleType(),
            'getThermocoupleType',
          );
          msg.payload = { ThermocoupleType };
          node.send(msg);
          break;
        }
        case 'setThermocoupleType': {
          invokeMethod(
            () => temperatureSensor.setThermocoupleType(msg.payload?.thermocoupleType),
            'setThermocoupleType',
          );
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }

  RED.nodes.registerType('phidget22-temperaturesensor', Phidget22TemperatureSensorNode);
};
