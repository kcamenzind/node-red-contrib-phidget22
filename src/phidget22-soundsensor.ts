import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type SoundSensorNodeExtraConfig = {
  dataInterval: number;
  SPLChangeTrigger: number;
  SPLRange: phidget22.SPLRange;
};
type SoundSensorNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & SoundSensorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22SoundSensorNode(this: nodeRED.Node, config: SoundSensorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const soundSensor = new phidget22.SoundSensor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    soundSensor.onAttach = () => {
      invokeMethod(
        () => soundSensor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => soundSensor.setSPLChangeTrigger(config.SPLChangeTrigger),
        'setSPLChangeTrigger (in onAttach)',
      );
      invokeMethod(() => soundSensor.setSPLRange(config.SPLRange), 'setSPLRange (in onAttach)');
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    soundSensor.onSPLChange = (dB, dBA, dBC, octaves) => {
      const msg = {
        topic: 'SPLChange',
        payload: { dB, dBA, dBC, octaves },
      };
      node.send(msg);
    };

    setupPhidgetDevice(soundSensor, node, config);
    openPhidgetDevice(soundSensor, 'SoundSensor', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInterval': {
          invokeMethod(
            () => soundSensor.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setSPLChangeTrigger': {
          invokeMethod(
            () => soundSensor.setSPLChangeTrigger(msg.payload?.SPLChangeTrigger),
            'setSPLChangeTrigger',
          );
          break;
        }
        case 'setSPLRange': {
          invokeMethod(() => soundSensor.setSPLRange(msg.payload?.SPLRange), 'setSPLRange');
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-soundsensor', Phidget22SoundSensorNode);
};
