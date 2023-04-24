import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type DistanceSensorNodeExtraConfig = {
  dataInterval: number;
  distanceChangeTrigger: number;
  sonarQuietMode: boolean;
};
type DistanceSensorNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & DistanceSensorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22DistanceSensorNode(this: nodeRED.Node, config: DistanceSensorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const distanceSensor = new phidget22.DistanceSensor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    distanceSensor.onAttach = () => {
      invokeMethod(
        () => distanceSensor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => distanceSensor.setDistanceChangeTrigger(config.distanceChangeTrigger),
        'setDistanceChangeTrigger (in onAttach)',
      );
      invokeMethod(
        () => distanceSensor.setSonarQuietMode(config.sonarQuietMode),
        'setSonarQuietMode (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    distanceSensor.onDistanceChange = (distance) => {
      const msg = { topic: 'DistanceChange', payload: { distance } };
      node.send(msg);
    };

    distanceSensor.onSonarReflectionsUpdate = (distances, amplitudes, count) => {
      const msg = {
        topic: 'SonarReflectionsUpdate',
        payload: { distances, amplitudes, count },
      };
      node.send(msg);
    };

    setupPhidgetDevice(distanceSensor, node, config);
    openPhidgetDevice(distanceSensor, 'DistanceSensor', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInteval': {
          invokeMethod(
            () => distanceSensor.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setDistanceChangeTrigger': {
          invokeMethod(
            () => distanceSensor.setDistanceChangeTrigger(msg.payload?.distanceChangeTrigger),
            'setDistanceChangeTrigger',
          );
          break;
        }
        case 'setSonarQuietMode': {
          invokeMethod(
            () => distanceSensor.setSonarQuietMode(msg.payload?.sonarQuietMode),
            'setSonarQuietMode',
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
  RED.nodes.registerType('phidget22-distancesensor', Phidget22DistanceSensorNode);
};
