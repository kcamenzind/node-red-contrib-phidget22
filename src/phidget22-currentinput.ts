import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type CurrentInputNodeExtraConfig = {
  dataInterval: number;
  currentChangeTrigger: number;
  powerSupply: phidget22.PowerSupply;
};
type CurrentInputNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & CurrentInputNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22CurrentInputNode(this: nodeRED.Node, config: CurrentInputNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const currentInput = new phidget22.CurrentInput();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    currentInput.onAttach = () => {
      invokeMethod(
        () => currentInput.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => currentInput.setCurrentChangeTrigger(config.currentChangeTrigger),
        'setCurrentChangeTrigger (in onAttach)',
      );
      invokeMethod(
        () => currentInput.setPowerSupply(config.powerSupply),
        'setPowerSupply (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    currentInput.onCurrentChange = (current) => {
      const msg = { topic: 'CurrentChange', payload: { current } };
      node.send(msg);
    };

    setupPhidgetDevice(currentInput, node, config);
    openPhidgetDevice(currentInput, 'CurrentInput', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setCurrentChangeTrigger': {
          invokeMethod(
            () => currentInput.setCurrentChangeTrigger(msg.payload?.currentChangeTrigger),
            'setCurrentChangeTrigger',
          );
          break;
        }
        case 'setDataInterval': {
          invokeMethod(
            () => currentInput.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setPowerSupply': {
          invokeMethod(
            () => currentInput.setPowerSupply(msg.payload?.powerSupply),
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

  RED.nodes.registerType('phidget22-currentinput', Phidget22CurrentInputNode);
};
