import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type HumiditySensorNodeExtraConfig = {
  dataInterval: number;
  humidityChangeTrigger: number;
};
type HumiditySensorNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & HumiditySensorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22HumiditySensorNode(this: nodeRED.Node, config: HumiditySensorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const humiditySensor = new phidget22.HumiditySensor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    humiditySensor.onAttach = () => {
      invokeMethod(
        () => humiditySensor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => humiditySensor.setHumidityChangeTrigger(config.humidityChangeTrigger),
        'setHumidityChangeTrigger (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    humiditySensor.onHumidityChange = (humidity) => {
      const msg = { topic: 'HumidityChange', payload: { humidity } };
      node.send(msg);
    };

    setupPhidgetDevice(humiditySensor, node, config);
    openPhidgetDevice(humiditySensor, 'HumiditySensor', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInterval': {
          invokeMethod(
            () => humiditySensor.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setHumidityChangeTrigger': {
          invokeMethod(
            () => humiditySensor.setHumidityChangeTrigger(msg.payload?.humidityChangeTrigger),
            'setHumidityChangeTrigger',
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
  RED.nodes.registerType('phidget22-humiditysensor', Phidget22HumiditySensorNode);
};
