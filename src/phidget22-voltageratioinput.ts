import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type VoltageRatioInputNodeExtraConfig = {
  dataInterval: number;
  voltageRatioChangeTrigger: number;
  sensorType: phidget22.VoltageRatioSensorType;
  bridgeGain: phidget22.BridgeGain;
};

type VoltageRatioInputNodeConfig = nodeRED.NodeDef &
  PhidgetNodeConfig &
  VoltageRatioInputNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22VoltageRatioInputNode(this: nodeRED.Node, config: VoltageRatioInputNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const voltageRatioInput = new phidget22.VoltageRatioInput();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    voltageRatioInput.onAttach = () => {
      invokeMethod(
        () => voltageRatioInput.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => voltageRatioInput.setVoltageRatioChangeTrigger(config.voltageRatioChangeTrigger),
        'setVoltageRatioChangeTrigger (in onAttach)',
      );
      invokeMethod(
        () => voltageRatioInput.setSensorType(config.sensorType),
        'setSensorType (in onAttach)',
      );
      invokeMethod(
        () => voltageRatioInput.setBridgeGain(config.bridgeGain),
        'setBridgeGain (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.log('attached');
      node.send(msg);
    };

    voltageRatioInput.onVoltageRatioChange = (voltageRatio) => {
      const msg = {
        topic: 'VoltageratioChange',
        payload: { voltageRatio },
      };
      node.send(msg);
    };

    voltageRatioInput.onSensorChange = (sensorValue, sensorUnit) => {
      const msg = {
        topic: 'SensorChange',
        payload: { sensorValue, sensorUnit },
      };
      node.send(msg);
    };

    setupPhidgetDevice(voltageRatioInput, node, config);
    openPhidgetDevice(voltageRatioInput, 'VoltageRatioInput', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setBridgeEnabled': {
          invokeMethod(
            () => voltageRatioInput.setBridgeEnabled(msg.payload?.bridgeEnabled),
            'setBridgeEnabled',
          );
          break;
        }
        case 'setBridgeGain': {
          invokeMethod(
            () => voltageRatioInput.setBridgeGain(msg.payload?.bridgeGain),
            'setBridgeGain',
          );
          break;
        }
        case 'setDataInterval': {
          invokeMethod(
            () => voltageRatioInput.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setSensorType': {
          invokeMethod(
            () => voltageRatioInput.setSensorType(msg.payload?.sensorType),
            'setSensorType',
          );
          break;
        }
        case 'setSensorValueChangeTrigger': {
          invokeMethod(
            () =>
              voltageRatioInput.setSensorValueChangeTrigger(msg.payload?.sensorValueChangeTrigger),
            'setSensorValueChangeTrigger',
          );
          break;
        }
        case 'setVoltageRatioChangeTrigger': {
          invokeMethod(
            () =>
              voltageRatioInput.setVoltageRatioChangeTrigger(
                msg.payload?.voltageRatioChangeTrigger,
              ),
            'setVoltageRatioChangeTrigger',
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

  RED.nodes.registerType('phidget22-voltageratioinput', Phidget22VoltageRatioInputNode);
};
