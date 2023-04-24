import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type LightSensorNodeExtraConfig = {
  dataInterval: number;
  illuminanceChangeTrigger: number;
};
type LightSensorNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & LightSensorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22LightSensorNode(this: nodeRED.Node, config: LightSensorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const lightSensor = new phidget22.LightSensor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    lightSensor.onAttach = () => {
      invokeMethod(
        () => lightSensor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => lightSensor.setIlluminanceChangeTrigger(config.illuminanceChangeTrigger),
        'setIlluminanceChangeTrigger (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    lightSensor.onIlluminanceChange = (illuminance) => {
      const msg = {
        topic: 'IlluminanceChange',
        payload: { illuminance },
      };
      node.send(msg);
    };

    setupPhidgetDevice(lightSensor, node, config);
    openPhidgetDevice(lightSensor, 'LightSensor', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInterval': {
          invokeMethod(
            () => lightSensor.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setIlluminanceChangeTrigger': {
          invokeMethod(
            () => lightSensor.setIlluminanceChangeTrigger(msg.payload?.illuminanceChangeTrigger),
            'setIlluminanceChangeTrigger',
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
  RED.nodes.registerType('phidget22-lightsensor', Phidget22LightSensorNode);
};
