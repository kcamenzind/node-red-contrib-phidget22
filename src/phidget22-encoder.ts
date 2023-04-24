import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type EncoderNodeExtraConfig = {
  dataInterval: number;
  positionChangeTrigger: number;
  IOMode: phidget22.EncoderIOMode;
};
type EncoderNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & EncoderNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22EncoderNode(this: nodeRED.Node, config: EncoderNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const encoder = new phidget22.Encoder();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    encoder.onAttach = () => {
      invokeMethod(
        () => encoder.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => encoder.setPositionChangeTrigger(config.positionChangeTrigger),
        'setPositionChangeTrigger (in onAttach)',
      );
      invokeMethod(() => encoder.setIOMode(config.IOMode), 'setIOMode (in onAttach)');
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    encoder.onPositionChange = (positionChange, timeChange, indexTriggered) => {
      const msg = {
        topic: 'PositionChange',
        payload: {
          positionChange,
          timeChange,
          indexTriggered,
        },
      };
      node.send(msg);
    };

    setupPhidgetDevice(encoder, node, config);
    openPhidgetDevice(encoder, 'Encoder', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setEnabled': {
          invokeMethod(() => encoder.setEnabled(msg.payload?.enabled), 'setEnabled');
          break;
        }

        case 'setDataInterval': {
          invokeMethod(() => encoder.setDataInterval(msg.payload?.dataInterval), 'setDataInterval');
          break;
        }

        case 'setIOMode': {
          invokeMethod(() => encoder.setIOMode(msg.payload?.IOMode), 'setIOMode');
          break;
        }

        case 'setPosition': {
          invokeMethod(() => encoder.setPosition(msg.payload?.position), 'setPosition');
          break;
        }

        case 'setPositionChangeTrigger': {
          invokeMethod(
            () => encoder.setPositionChangeTrigger(msg.payload?.positionChangeTrigger),
            'setPositionChangeTrigger',
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
  RED.nodes.registerType('phidget22-encoder', Phidget22EncoderNode);
};
