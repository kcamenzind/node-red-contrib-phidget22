import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type ResistanceInputNodeExtraConfig = {
  dataInterval: number;
  resistanceChangeTrigger: number;
  RTDWireSetup: phidget22.RTDWireSetup;
};
type ResistanceInputNodeConfig = nodeRED.NodeDef &
  PhidgetNodeConfig &
  ResistanceInputNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22ResistanceInputNode(this: nodeRED.Node, config: ResistanceInputNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const resistanceInput = new phidget22.ResistanceInput();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    resistanceInput.onAttach = () => {
      invokeMethod(
        () => resistanceInput.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => resistanceInput.setResistanceChangeTrigger(config.resistanceChangeTrigger),
        'setResistanceChangeTrigger (in onAttach)',
      );
      invokeMethod(
        () => resistanceInput.setRTDWireSetup(config.RTDWireSetup),
        'setRTDWireSetup (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    resistanceInput.onResistanceChange = (resistance) => {
      const msg = {
        topic: 'ResistanceChange',
        payload: { resistance },
      };
      node.send(msg);
    };

    setupPhidgetDevice(resistanceInput, node, config);
    openPhidgetDevice(resistanceInput, 'ResistanceInput', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInterval': {
          invokeMethod(
            () => resistanceInput.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setResistanceChangeTrigger': {
          invokeMethod(
            () => resistanceInput.setResistanceChangeTrigger(msg.payload?.resistanceChangeTrigger),
            'setResistanceChangeTrigger',
          );
          break;
        }
        case 'setRTDWireSetup': {
          invokeMethod(
            () => resistanceInput.setRTDWireSetup(msg.payload?.RTDWireSetup),
            'setRTDWireSetup',
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
  RED.nodes.registerType('phidget22-resistanceinput', Phidget22ResistanceInputNode);
};
