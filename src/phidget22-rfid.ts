import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22RFIDNode(this: nodeRED.Node, config: PhidgetNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const rfid = new phidget22.RFID();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    rfid.onAttach = () => {
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    rfid.onTag = (tag, protocol) => {
      const msg = { topic: 'Tag', payload: { tag, protocol } };
      node.send(msg);
    };

    rfid.onTagLost = (tag, protocol) => {
      const msg = {
        topic: 'TagLost',
        payload: { tag, protocol },
      };
      node.send(msg);
    };

    setupPhidgetDevice(rfid, node, config);
    openPhidgetDevice(rfid, 'RFID', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setAntennaEnabled': {
          invokeMethod(
            () => rfid.setAntennaEnabled(msg.payload?.antennaEnabled),
            'setAntennaEnabled',
          );
          break;
        }
        case 'write': {
          invokeMethod(
            () => rfid.write(msg.payload?.tagString, msg.payload?.protocol, msg.payload?.lockTag),
            'write',
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
  RED.nodes.registerType('phidget22-rfid', Phidget22RFIDNode);
};
