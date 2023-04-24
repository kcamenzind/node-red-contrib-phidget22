import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type BLDCMotorNodeExtraConfig = {
  acceleration: number;
  dataInterval: number;
  targetBrakingStrength: number;
  stallVelocity: number;
  rescaleFactor: number;
};
type BLDCMotorNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & BLDCMotorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22BLDCMotorNode(this: nodeRED.Node, config: BLDCMotorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const bldcMotor = new phidget22.BLDCMotor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    bldcMotor.onAttach = () => {
      invokeMethod(
        () => bldcMotor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => bldcMotor.setRescaleFactor(config.rescaleFactor),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => bldcMotor.setAcceleration(config.acceleration),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => bldcMotor.setTargetBrakingStrength(config.targetBrakingStrength),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => bldcMotor.setStallVelocity(config.stallVelocity),
        'setDataInterval (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    bldcMotor.onPositionChange = (position) => {
      const msg = { topic: 'PositionChange', payload: { position } };
      node.send(msg);
    };

    bldcMotor.onVelocityUpdate = (velocity) => {
      const msg = { topic: 'VelocityUpdate', payload: { velocity } };
      node.send(msg);
    };

    bldcMotor.onBrakingStrengthChange = (brakingStrength) => {
      const msg = { topic: 'BrakingStrengthChange', payload: { brakingStrength } };
      node.send(msg);
    };

    setupPhidgetDevice(bldcMotor, node, config);
    openPhidgetDevice(bldcMotor, 'BLDCMotor', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setAcceleration': {
          invokeMethod(
            () => bldcMotor.setAcceleration(msg.payload?.acceleration),
            'setAcceleration',
          );
          break;
        }

        case 'setDataInterval': {
          invokeMethod(
            () => bldcMotor.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }

        case 'enableFailsafe': {
          invokeMethod(() => bldcMotor.enableFailsafe(msg.payload?.failsafeTime), 'enableFailsafe');
          break;
        }

        case 'addPositionOffset': {
          invokeMethod(
            () => bldcMotor.addPositionOffset(msg.payload?.positionOffset),
            'addPositionOffset',
          );
          break;
        }

        case 'setRescaleFactor': {
          invokeMethod(
            () => bldcMotor.setRescaleFactor(msg.payload?.rescaleFactor),
            'setRescaleFactor',
          );
          break;
        }

        case 'resetFailsafe': {
          invokeMethod(() => bldcMotor.resetFailsafe(), 'resetFailsafe');
          break;
        }

        case 'setStallVelocity': {
          invokeMethod(
            () => bldcMotor.setStallVelocity(msg.payload?.stallVelocity),
            'setStallVelocity',
          );
          break;
        }

        case 'setTargetBrakingStrength': {
          invokeMethod(
            () => bldcMotor.setTargetBrakingStrength(msg.payload?.targetBrakingStrength),
            'setTargetBrakingStrength',
          );
          break;
        }

        case 'setTargetVelocity': {
          invokeMethod(
            () => bldcMotor.setTargetVelocity(msg.payload?.targetVelocity),
            'setTargetVelocity',
          );
          break;
        }

        default:
          node.error('Unsupported message topic: ' + msg.topic);
          break;
      }
    });
  }
  RED.nodes.registerType('phidget22-bldcmotor', Phidget22BLDCMotorNode);
};
