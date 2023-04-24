import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type RCServoNodeExtraConfig = {
  dataInterval: number;
  voltage: number;
  minPosition: number;
  maxPosition: number;
  minPulseWidth: number;
  maxPulseWidth: number;
  acceleration: number;
  speedRampingState: boolean;
  velocityLimit: number;
};
type RCServoNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & RCServoNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22RCServoNode(this: nodeRED.Node, config: RCServoNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const rcServo = new phidget22.RCServo();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    rcServo.onAttach = () => {
      invokeMethod(
        () => rcServo.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => rcServo.setAcceleration(config.acceleration),
        'setAcceleration (in onAttach)',
      );
      invokeMethod(
        () => rcServo.setSpeedRampingState(config.speedRampingState),
        'setSpeedRampingState (in onAttach)',
      );
      invokeMethod(
        () => rcServo.setVelocityLimit(config.velocityLimit),
        'setVelocityLimit (in onAttach)',
      );
      invokeMethod(() => rcServo.setVoltage(config.voltage), 'setVoltage (in onAttach)');
      invokeMethod(
        () => rcServo.setMinPulseWidth(config.minPulseWidth),
        'setMinPulseWidth (in onAttach)',
      );
      invokeMethod(
        () => rcServo.setMaxPulseWidth(config.maxPulseWidth),
        'setMaxPulseWidth (in onAttach)',
      );
      invokeMethod(
        () => rcServo.setMinPosition(config.minPosition),
        'setMinPosition (in onAttach)',
      );
      invokeMethod(
        () => rcServo.setMaxPosition(config.maxPosition),
        'setMaxPosition (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    rcServo.onPositionChange = (position) => {
      const msg = { topic: 'PositionChange', payload: { position } };
      node.send(msg);
    };

    rcServo.onTargetPositionReached = (position) => {
      const msg = {
        topic: 'TargetPositionReached',
        payload: { position },
      };
      node.send(msg);
    };

    rcServo.onVelocityChange = (velocity) => {
      const msg = { topic: 'VelocityChange', payload: { velocity } };
      node.send(msg);
    };

    setupPhidgetDevice(rcServo, node, config);
    openPhidgetDevice(rcServo, 'RCServo', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setAcceleration': {
          invokeMethod(() => rcServo.setAcceleration(msg.payload?.acceleration), 'setAcceleration');
          break;
        }
        case 'setDataInterval': {
          invokeMethod(() => rcServo.setDataInterval(msg.payload?.dataInterval), 'setDataInterval');
          break;
        }
        case 'setEngaged': {
          invokeMethod(() => rcServo.setEngaged(msg.payload?.engaged), 'setEngaged');
          break;
        }
        case 'enableFailsafe': {
          invokeMethod(() => rcServo.enableFailsafe(msg.payload?.failsafeTime), 'enableFailsafe');
          break;
        }
        case 'setMinPosition': {
          invokeMethod(() => rcServo.setMinPosition(msg.payload?.minPosition), 'setMinPosition');
          break;
        }
        case 'setMaxPosition': {
          invokeMethod(() => rcServo.setMaxPosition(msg.payload?.maxPosition), 'setMaxPosition');
          break;
        }
        case 'setMinPulseWidth': {
          invokeMethod(
            () => rcServo.setMinPulseWidth(msg.payload?.minPulseWidth),
            'setMinPulseWidth',
          );
          break;
        }
        case 'setMaxPulseWidth': {
          invokeMethod(
            () => rcServo.setMaxPulseWidth(msg.payload?.maxPulseWidth),
            'setMaxPulseWidth',
          );
          break;
        }
        case 'resetFailsafe': {
          invokeMethod(() => rcServo.resetFailsafe(), 'resetFailsafe');
          break;
        }
        case 'setSpeedRampingState': {
          invokeMethod(
            () => rcServo.setSpeedRampingState(msg.payload?.speedRampingState),
            'setSpeedRampingState',
          );
          break;
        }
        case 'setTargetPosition': {
          invokeMethod(
            () => rcServo.setTargetPosition(msg.payload?.targetPosition),
            'setTargetPosition',
          );
          break;
        }
        case 'setTorque': {
          invokeMethod(() => rcServo.setTorque(msg.payload?.torque), 'setTorque');
          break;
        }
        case 'setVelocityLimit': {
          invokeMethod(
            () => rcServo.setVelocityLimit(msg.payload?.velocityLimit),
            'setVelocityLimit',
          );
          break;
        }
        case 'setVoltage': {
          invokeMethod(() => rcServo.setVoltage(msg.payload?.voltage), 'setVoltage');
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-rcservo', Phidget22RCServoNode);
};
