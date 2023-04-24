import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type DigitalOutputNodeExtraConfig = {
  LEDCurrentLimit: number;
  LEDForwardVoltage: number;
};
type DigitalOutputNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & DigitalOutputNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22DigitalOutputNode(this: nodeRED.Node, config: DigitalOutputNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const digitalOutput = new phidget22.DigitalOutput();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    digitalOutput.onAttach = () => {
      invokeMethod(
        () => digitalOutput.setLEDForwardVoltage(config.LEDForwardVoltage),
        'setLEDForwardVoltage (in onAttach)',
      );
      invokeMethod(
        () => digitalOutput.setLEDCurrentLimit(config.LEDCurrentLimit),
        'setLEDCurrentLimit (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    setupPhidgetDevice(digitalOutput, node, config);
    openPhidgetDevice(digitalOutput, 'DigitalOutput', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDutyCycle': {
          invokeMethod(() => digitalOutput.setDutyCycle(msg.payload?.dutyCycle), 'setDutyCycle');
          break;
        }
        case 'enableFailsafe': {
          invokeMethod(
            () => digitalOutput.enableFailsafe(msg.payload?.failsafeTime),
            'enableFailsafe',
          );
          break;
        }
        case 'setLEDCurrentLimit': {
          invokeMethod(
            () => digitalOutput.setLEDCurrentLimit(msg.payload?.LEDCurrentLimit),
            'setLEDCurrentLimit',
          );
          break;
        }
        case 'setLEDForwardVoltage': {
          invokeMethod(
            () => digitalOutput.setLEDForwardVoltage(msg.payload?.LEDForwardVoltage),
            'setLEDForwardVoltage',
          );
          break;
        }
        case 'resetFailsafe': {
          invokeMethod(() => digitalOutput.resetFailsafe(), 'resetFailsafe');
          break;
        }
        case 'setState': {
          invokeMethod(() => digitalOutput.setState(msg.payload?.state), 'setState');
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-digitaloutput', Phidget22DigitalOutputNode);
};
