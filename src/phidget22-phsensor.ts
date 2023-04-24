import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type PHSensorNodeExtraConfig = {
  dataInterval: number;
  PHChangeTrigger: number;
  correctionTemperature: number;
};
type PHSensorNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & PHSensorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22PHSensorNode(this: nodeRED.Node, config: PHSensorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const phSensor = new phidget22.PHSensor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    phSensor.onAttach = () => {
      invokeMethod(
        () => phSensor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => phSensor.setPHChangeTrigger(config.PHChangeTrigger),
        'setPHChangeTrigger (in onAttach)',
      );
      invokeMethod(
        () => phSensor.setCorrectionTemperature(config.correctionTemperature),
        'setCorrectionTemperature (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    phSensor.onPHChange = (PH) => {
      const msg = { topic: 'PHChange', payload: { PH } };
      node.send(msg);
    };

    setupPhidgetDevice(phSensor, node, config);
    openPhidgetDevice(phSensor, 'PHSensor', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setCorrectionTemperature': {
          invokeMethod(
            () => phSensor.setCorrectionTemperature(msg.payload?.correctionTemperature),
            'setCorrectionTemperature',
          );
          break;
        }
        case 'setDataInterval': {
          invokeMethod(
            () => phSensor.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setPHChangeTrigger': {
          invokeMethod(
            () => phSensor.setPHChangeTrigger(msg.payload?.PHChangeTrigger),
            'setPHChangeTrigger',
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
  RED.nodes.registerType('phidget22-phsensor', Phidget22PHSensorNode);
};
