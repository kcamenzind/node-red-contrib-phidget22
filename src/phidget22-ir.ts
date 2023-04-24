import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22IRNode(this: nodeRED.Node, config: PhidgetNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const ir = new phidget22.IR();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    setupPhidgetDevice(ir, node, config);
    openPhidgetDevice(ir, 'IR', node, state, config);

    ir.onAttach = () => {
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    ir.onCode = (code, bitCount, isRepeat) => {
      const msg = {
        topic: 'Code',
        payload: { code, bitCount, isRepeat },
      };
      node.send(msg);
    };

    ir.onLearn = (code, codeInfo) => {
      const msg = {
        topic: 'Learn',
        payload: { code, codeInfo },
      };
      node.send(msg);
    };

    ir.onRawData = (data) => {
      const msg = { topic: 'RawData', payload: { data } };
      node.send(msg);
    };

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'transmit': {
          invokeMethod(() => ir.transmit(msg.payload?.code, msg.payload?.codeInfo), 'transmit');
          break;
        }
        case 'transmitRaw': {
          invokeMethod(
            () =>
              ir.transmitRaw(
                msg.payload?.data,
                msg.payload?.carrierFrequency,
                msg.payload?.dutyCycle,
                msg.payload?.gap,
              ),
            'transmitRaw',
          );
          break;
        }
        case 'transmitRepeat': {
          invokeMethod(() => ir.transmitRepeat(), 'transmitRepeat');
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-ir', Phidget22IRNode);
};
