import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type AccelerometerNodeExtraConfig = {
  dataInterval: number;
  accelerationChangeTrigger: number;
};
type AccelerometerNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & AccelerometerNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22AccelerometerNode(this: nodeRED.Node, config: AccelerometerNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const accelerometer: phidget22.Accelerometer = new phidget22.Accelerometer();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    accelerometer.onAttach = () => {
      invokeMethod(
        () => accelerometer.setAccelerationChangeTrigger(config.accelerationChangeTrigger),
        'setAccelerationChangeTrigger (in onAttach)',
      );
      invokeMethod(
        () => accelerometer.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    accelerometer.onAccelerationChange = (acceleration, timestamp) => {
      const msg = { topic: 'AccelerationChange', payload: { acceleration, timestamp } };
      node.send(msg);
    };

    setupPhidgetDevice(accelerometer, node, config);
    openPhidgetDevice(accelerometer, 'Accelerometer', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setAccelerationChangeTrigger': {
          invokeMethod(
            () =>
              accelerometer.setAccelerationChangeTrigger(msg.payload?.accelerationChangeTrigger),
            'setAccelerationChangeTrigger',
          );
          break;
        }
        case 'setDataInterval': {
          invokeMethod(
            () => accelerometer.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
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

  RED.nodes.registerType('phidget22-accelerometer', Phidget22AccelerometerNode);
};
