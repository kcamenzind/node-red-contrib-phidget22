import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22GPSNode(this: nodeRED.Node, config: PhidgetNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const gps = new phidget22.GPS();

    gps.onAttach = () => {
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    gps.onHeadingChange = (heading, velocity) => {
      const msg = {
        topic: 'HeadingChange',
        payload: { heading, velocity },
      };
      node.send(msg);
    };

    gps.onPositionChange = (latitude, longitude, altitude) => {
      const msg = {
        topic: 'PositionChange',
        payload: {
          latitude,
          longitude,
          altitude,
        },
      };
      node.send(msg);
    };

    gps.onPositionFixStateChange = (positionFixState) => {
      const msg = {
        topic: 'PositionFixStateChange',
        payload: { positionFixState },
      };
      node.send(msg);
    };

    setupPhidgetDevice(gps, node, config);
    openPhidgetDevice(gps, 'GPS', node, state, config);
  }
  RED.nodes.registerType('phidget22-gps', Phidget22GPSNode);
};
