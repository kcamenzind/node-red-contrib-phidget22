import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type GyroscopeNodeExtraConfig = {
  dataInterval: number;
};
type GyroscopeNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & GyroscopeNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22GyroscopeNode(this: nodeRED.Node, config: GyroscopeNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const gyroscope = new phidget22.Gyroscope();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    gyroscope.onAttach = () => {
      invokeMethod(
        () => gyroscope.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    gyroscope.onAngularRateUpdate = function (angularRate, timestamp) {
      const msg = {
        topic: 'AngularRateUpdate',
        payload: { angularRate, timestamp },
      };
      node.send(msg);
    };

    setupPhidgetDevice(gyroscope, node, config);
    openPhidgetDevice(gyroscope, 'Gyroscope', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInterval': {
          invokeMethod(
            () => gyroscope.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'zero': {
          invokeMethod(() => gyroscope.zero(), 'zero');
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-gyroscope', Phidget22GyroscopeNode);
};
