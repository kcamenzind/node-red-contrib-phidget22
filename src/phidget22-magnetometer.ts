import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type MagnetometerNodeExtraConfig = {
  dataInterval: number;
  magneticFieldChangeTrigger: number;
  magneticField: number;
  offset0: number;
  offset1: number;
  offset2: number;
  gain0: number;
  gain1: number;
  gain2: number;
  T0: number;
  T1: number;
  T2: number;
  T3: number;
  T4: number;
  T5: number;
  setParams: boolean;
};
type MagnetometerNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & MagnetometerNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22MagnetometerNode(this: nodeRED.Node, config: MagnetometerNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const magnetometer = new phidget22.Magnetometer();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    magnetometer.onAttach = () => {
      invokeMethod(
        () => magnetometer.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => magnetometer.setMagneticFieldChangeTrigger(config.magneticFieldChangeTrigger),
        'setMagneticFieldChangeTrigger (in onAttach)',
      );
      if (config.setParams === true) {
        invokeMethod(
          () =>
            magnetometer.setCorrectionParameters(
              config.magneticField,
              config.offset0,
              config.offset1,
              config.offset2,
              config.gain0,
              config.gain1,
              config.gain2,
              config.T0,
              config.T1,
              config.T2,
              config.T3,
              config.T4,
              config.T5,
            ),
          'setCorrectionParameters (in onAttach)',
        );
      }
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    magnetometer.onMagneticFieldChange = (magneticField, timestamp) => {
      const msg = {
        topic: 'MagneticFieldChange',
        payload: { magneticField, timestamp },
      };
      node.send(msg);
    };

    setupPhidgetDevice(magnetometer, node, config);
    openPhidgetDevice(magnetometer, 'Magnetometer', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setCorrectionParameters': {
          invokeMethod(
            () =>
              magnetometer.setCorrectionParameters(
                msg.payload?.magneticField,
                msg.payload?.offset0,
                msg.payload?.offset1,
                msg.payload?.offset2,
                msg.payload?.gain0,
                msg.payload?.gain1,
                msg.payload?.gain2,
                msg.payload?.T0,
                msg.payload?.T1,
                msg.payload?.T2,
                msg.payload?.T3,
                msg.payload?.T4,
                msg.payload?.T5,
              ),
            'setCorrectionParameters',
          );
          break;
        }
        case 'setDataInterval': {
          invokeMethod(
            () => magnetometer.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setMagneticFieldChangeTrigger': {
          invokeMethod(
            () =>
              magnetometer.setMagneticFieldChangeTrigger(msg.payload?.magneticFieldChangeTrigger),
            'setMagneticFieldChangeTrigger',
          );
          break;
        }
        case 'resetCorrectionParameters': {
          invokeMethod(() => magnetometer.resetCorrectionParameters(), 'resetCorrectionParameters');
          break;
        }
        case 'saveCorrectionParameters': {
          invokeMethod(() => magnetometer.saveCorrectionParameters(), 'saveCorrectionParameters');
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-magnetometer', Phidget22MagnetometerNode);
};
