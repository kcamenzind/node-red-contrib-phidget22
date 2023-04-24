import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22HubNode(this: nodeRED.Node, config: PhidgetNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const hub = new phidget22.Hub();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    hub.onAttach = () => {
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    setupPhidgetDevice(hub, node, config);
    openPhidgetDevice(hub, 'Hub', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setPortPower': {
          invokeMethod(
            () => hub.setPortPower(msg.payload?.port, msg.payload?.state),
            'setPortPower',
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
  RED.nodes.registerType('phidget22-hub', Phidget22HubNode);
};
