import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type SpatialNodeExtraConfig = {
  dataInterval: number;
  algorithm: phidget22.SpatialAlgorithm;
  algorithmMagnetometerGain: number;
};
type SpatialNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & SpatialNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22SpatialNode(this: nodeRED.Node, config: SpatialNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const spatial = new phidget22.Spatial();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    spatial.onAttach = () => {
      invokeMethod(
        () => spatial.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(() => spatial.setAlgorithm(config.algorithm), 'setAlgorithm (in onAttach)');
      invokeMethod(
        () => spatial.setAlgorithmMagnetometerGain(config.algorithmMagnetometerGain),
        'setAlgorithmMagnetometerGain (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    spatial.onSpatialData = (acceleration, angularRate, magneticField, timestamp) => {
      const msg = {
        topic: 'SpatialData',
        payload: {
          acceleration,
          angularRate,
          magneticField,
          timestamp,
        },
      };
      node.send(msg);
    };

    spatial.onAlgorithmData = (quaternion, timestamp) => {
      const msg = {
        topic: 'AlgorithmData',
        payload: { quaternion, timestamp },
      };
      node.send(msg);
    };

    setupPhidgetDevice(spatial, node, config);
    openPhidgetDevice(spatial, 'Spatial', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setAlgorithm': {
          invokeMethod(() => spatial.setAlgorithm(msg.payload?.algorithm), 'setAlgorithm');
          break;
        }
        case 'setAlgorithmMagnetometerGain': {
          invokeMethod(
            () => spatial.setAlgorithmMagnetometerGain(msg.payload?.algorithmMagnetometerGain),
            'setAlgorithmMagnetometerGain',
          );
          break;
        }
        case 'setDataInterval': {
          invokeMethod(() => spatial.setDataInterval(msg.payload?.dataInterval), 'setDataInterval');
          break;
        }

        case 'setMagnetometerCorrectionParameters': {
          invokeMethod(
            () =>
              spatial.setMagnetometerCorrectionParameters(
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
            'setMagnetometerCorrectionParameters',
          );
          break;
        }
        case 'resetMagnetometerCorrectionParameters': {
          invokeMethod(
            () => spatial.resetMagnetometerCorrectionParameters(),
            'resetMagnetometerCorrectionParameters',
          );
          break;
        }
        case 'saveMagnetometerCorrectionParameters': {
          invokeMethod(
            () => spatial.saveMagnetometerCorrectionParameters(),
            'saveMagnetometerCorrectionParameters',
          );
          break;
        }
        case 'zeroAlgorithm': {
          invokeMethod(() => spatial.zeroAlgorithm(), 'zeroAlgorithm');
          break;
        }
        case 'zeroGyro': {
          invokeMethod(() => spatial.zeroGyro(), 'zeroGyro');
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-spatial', Phidget22SpatialNode);
};
