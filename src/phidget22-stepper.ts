import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type StepperNodeExtraConfig = {
  dataInterval: number;
  controlMode: phidget22.StepperControlMode;
  currentLimit: number;
  velocitylimit: number;
  holdingCurrentLimit: number;
  acceleration: number;
};
type StepperNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & StepperNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22StepperNode(this: nodeRED.Node, config: StepperNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const stepper = new phidget22.Stepper();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    stepper.onAttach = () => {
      invokeMethod(
        () => stepper.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => stepper.setAcceleration(config.acceleration),
        'setAcceleration (in onAttach)',
      );
      invokeMethod(
        () => stepper.setVelocityLimit(config.velocitylimit),
        'setVelocityLimit (in onAttach)',
      );
      invokeMethod(
        () => stepper.setCurrentLimit(config.currentLimit),
        'setCurrentLimit (in onAttach)',
      );
      invokeMethod(
        () => stepper.setHoldingCurrentLimit(config.holdingCurrentLimit),
        'setHoldingCurrentLimit (in onAttach)',
      );
      invokeMethod(
        () => stepper.setControlMode(config.controlMode),
        'setControlMode (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    stepper.onPositionChange = (position) => {
      const msg = { topic: 'PositionChange', payload: { position } };
      node.send(msg);
    };

    stepper.onVelocityChange = (velocity) => {
      const msg = { topic: 'VelocityChange', payload: { velocity } };
      node.send(msg);
    };

    stepper.onStopped = () => {
      const msg = { topic: 'Stopped', payload: {} };
      node.send(msg);
    };

    setupPhidgetDevice(stepper, node, config);
    openPhidgetDevice(stepper, 'Stepper', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setAcceleration': {
          invokeMethod(() => stepper.setAcceleration(msg.payload?.acceleration), 'setAcceleration');
          break;
        }
        case 'setControlMode': {
          invokeMethod(() => stepper.setControlMode(msg.payload?.controlMode), 'setControlMode');
          break;
        }
        case 'setCurrentLimit': {
          invokeMethod(() => stepper.setCurrentLimit(msg.payload?.currentLimit), 'setCurrentLimit');
          break;
        }
        case 'setDataInterval': {
          invokeMethod(() => stepper.setDataInterval(msg.payload?.dataInterval), 'setDataInterval');
          break;
        }
        case 'setEngaged': {
          invokeMethod(() => stepper.setEngaged(msg.payload?.engaged), 'setEngaged');
          break;
        }
        case 'enableFailsafe': {
          invokeMethod(() => stepper.enableFailsafe(msg.payload?.failsafeTime), 'enableFailsafe');
          break;
        }
        case 'setHoldingCurrentLimit': {
          invokeMethod(
            () => stepper.setHoldingCurrentLimit(msg.payload?.holdingCurrent),
            'setHoldingCurrentLimit',
          );
          break;
        }
        case 'addPositionOffset': {
          invokeMethod(
            () => stepper.addPositionOffset(msg.payload?.positionOffset),
            'addPositionOffset',
          );
          break;
        }
        case 'setRescaleFactor': {
          invokeMethod(
            () => stepper.setRescaleFactor(msg.payload?.rescaleFactor),
            'setRescaleFactor',
          );
          break;
        }
        case 'resetFailsafe': {
          invokeMethod(() => stepper.resetFailsafe(), 'resetFailsafe');
          break;
        }
        case 'setTargetPosition': {
          invokeMethod(
            () => stepper.setTargetPosition(msg.payload?.targetPosition),
            'setTargetPosition',
          );
          break;
        }
        case 'setVelocityLimit': {
          invokeMethod(
            () => stepper.setVelocityLimit(msg.payload?.velocityLimit),
            'setVelocityLimit',
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
  RED.nodes.registerType('phidget22-stepper', Phidget22StepperNode);
};
