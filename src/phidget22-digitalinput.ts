import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type DigitalInputNodeExtraConfig = {
  inputMode: phidget22.InputMode;
  powerSupply: phidget22.PowerSupply;
};
type DigitalInputNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & DigitalInputNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22DigitalInputNode(this: nodeRED.Node, config: DigitalInputNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const digitalInput = new phidget22.DigitalInput();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    digitalInput.onAttach = () => {
      invokeMethod(
        () => digitalInput.setPowerSupply(config.powerSupply),
        'setPowerSupply (in onAttach)',
      );
      invokeMethod(() => digitalInput.setInputMode(config.inputMode), 'setInputMode (in onAttach)');

      const attachMsg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(attachMsg);

      // Send initial stateChange event so the user knows the starting state
      const stateChangeMsg = {
        topic: 'StateChange',
        payload: { state: digitalInput.getState() },
      };
      node.send(stateChangeMsg);
    };

    digitalInput.onStateChange = (state) => {
      const msg = { topic: 'StateChange', payload: { state } };
      node.send(msg);
    };

    setupPhidgetDevice(digitalInput, node, config);
    openPhidgetDevice(digitalInput, 'DigitalInput', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setInputMode': {
          invokeMethod(() => digitalInput.setInputMode(msg.payload?.inputMode), 'setInputMode');
          break;
        }
        case 'setPowerSupply': {
          invokeMethod(
            () => digitalInput.setPowerSupply(msg.payload?.powerSupply),
            'setPowerSupply',
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
  RED.nodes.registerType('phidget22-digitalinput', Phidget22DigitalInputNode);
};
