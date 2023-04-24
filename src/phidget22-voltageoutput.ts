import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type VoltageOutputNodeExtraConfig = {
  dataInterval: number;
  voltageOutputRange: number;
};
type VoltageOutputNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & VoltageOutputNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22VoltageOutputNode(this: nodeRED.Node, config: VoltageOutputNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const voltageOutput = new phidget22.VoltageOutput();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    voltageOutput.onAttach = () => {
      invokeMethod(
        () => voltageOutput.setVoltageOutputRange(config.voltageOutputRange),
        'setVoltageOutputRange (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    setupPhidgetDevice(voltageOutput, node, config);
    openPhidgetDevice(voltageOutput, 'VoltageOutput', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setEnabled': {
          invokeMethod(() => voltageOutput.setEnabled(msg.payload?.enabled), 'setEnabled');
          break;
        }
        case 'enableFailsafe': {
          invokeMethod(
            () => voltageOutput.enableFailsafe(msg.payload?.failsafeTime),
            'enableFailsafe',
          );
          break;
        }
        case 'resetFailsafe': {
          invokeMethod(() => voltageOutput.resetFailsafe(), 'resetFailsafe');
          break;
        }
        case 'setVoltage': {
          invokeMethod(() => voltageOutput.setVoltage(msg.payload?.voltage), 'setVoltage');
          break;
        }
        case 'setVoltageOutputRange': {
          invokeMethod(
            () => voltageOutput.setVoltageOutputRange(msg.payload?.voltageOutputRange),
            'setVoltageOutputRange',
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
  RED.nodes.registerType('phidget22-voltageoutput', Phidget22VoltageOutputNode);
};
