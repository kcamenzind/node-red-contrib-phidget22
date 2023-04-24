import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type VoltageInputNodeExtraConfig = {
  dataInterval: number;
  voltageChangeTrigger: number;
  sensorType: phidget22.VoltageSensorType;
  powerSupply: phidget22.PowerSupply;
  voltageRange: number;
};
type VoltageInputNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & VoltageInputNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22VoltageInputNode(this: nodeRED.Node, config: VoltageInputNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const voltageInput = new phidget22.VoltageInput();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    voltageInput.onAttach = () => {
      invokeMethod(
        () => voltageInput.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => voltageInput.setVoltageChangeTrigger(config.voltageChangeTrigger),
        'setVoltageChangeTrigger (in onAttach)',
      );
      invokeMethod(
        () => voltageInput.setSensorType(config.sensorType),
        'setSensorType (in onAttach)',
      );
      invokeMethod(
        () => voltageInput.setPowerSupply(config.powerSupply),
        'setPowerSupply (in onAttach)',
      );
      invokeMethod(
        () => voltageInput.setVoltageRange(config.voltageRange),
        'setVoltageRange (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.log('attached');
      node.send(msg);
    };

    voltageInput.onVoltageChange = (voltage) => {
      const msg = { topic: 'VoltageChange', payload: { voltage } };
      node.send(msg);
    };

    voltageInput.onSensorChange = (sensorValue, sensorUnit) => {
      const msg = {
        topic: 'SensorChange',
        payload: { sensorValue, sensorUnit },
      };
      node.send(msg);
    };

    setupPhidgetDevice(voltageInput, node, config);
    openPhidgetDevice(voltageInput, 'VoltageInput', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInterval': {
          invokeMethod(
            () => voltageInput.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setPowerSupply': {
          invokeMethod(
            () => voltageInput.setPowerSupply(msg.payload?.powerSupply),
            'setPowerSupply',
          );
          break;
        }
        case 'setSensorType': {
          invokeMethod(() => voltageInput.setSensorType(msg.payload?.sensorType), 'setSensorType');
          break;
        }
        case 'setSensorValueChangeTrigger': {
          invokeMethod(
            () => voltageInput.setSensorValueChangeTrigger(msg.payload?.sensorValueChangeTrigger),
            'setSensorValueChangeTrigger',
          );

          break;
        }
        case 'setVoltageChangeTrigger': {
          invokeMethod(
            () => voltageInput.setVoltageChangeTrigger(msg.payload?.voltageChangeTrigger),
            'setVoltageChangeTrigger',
          );
          break;
        }
        case 'setVoltageRange': {
          invokeMethod(
            () => voltageInput.setVoltageRange(msg.payload?.voltageRange),
            'setVoltageRange',
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
  RED.nodes.registerType('phidget22-voltageinput', Phidget22VoltageInputNode);
};
