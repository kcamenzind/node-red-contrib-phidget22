import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type MotorPositionControllerNodeExtraConfig = {
  dataInterval: number;
  fanMode: phidget22.FanMode;
  IOMode: phidget22.EncoderIOMode;
  kp: number;
  ki: number;
  kd: number;
  velocityLimit: number;
  stallVelocity: number;
  acceleration: number;
  deadBand: number;
};
type MotorPositionControllerNodeConfig = nodeRED.NodeDef &
  PhidgetNodeConfig &
  MotorPositionControllerNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22MotorPositionControllerNode(
    this: nodeRED.Node,
    config: MotorPositionControllerNodeConfig,
  ) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const motorPositionController = new phidget22.MotorPositionController();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    motorPositionController.onAttach = () => {
      invokeMethod(
        () => motorPositionController.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(() => motorPositionController.setKp(config.kp), 'setKp (in onAttach)');
      invokeMethod(() => motorPositionController.setKi(config.ki), 'setKi (in onAttach)');
      invokeMethod(() => motorPositionController.setKd(config.kd), 'setKd (in onAttach)');
      invokeMethod(
        () => motorPositionController.setAcceleration(config.acceleration),
        'setAcceleration (in onAttach)',
      );
      invokeMethod(
        () => motorPositionController.setVelocityLimit(config.velocityLimit),
        'setVelocityLimit (in onAttach)',
      );
      invokeMethod(
        () => motorPositionController.setStallVelocity(config.stallVelocity),
        'setStallVelocity (in onAttach)',
      );
      invokeMethod(
        () => motorPositionController.setDeadBand(config.deadBand),
        'setDeadBand (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    motorPositionController.onPositionChange = (position) => {
      const msg = { topic: 'PositionChange', payload: { position } };
      node.send(msg);
    };

    motorPositionController.onDutyCycleUpdate = (dutyCycle) => {
      const msg = {
        topic: 'DutyCycleUpdate',
        payload: { dutyCycle },
      };
      node.send(msg);
    };

    setupPhidgetDevice(motorPositionController, node, config);
    openPhidgetDevice(motorPositionController, 'MotorPositionController', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'getAcceleration': {
          const Acceleration = invokeMethod(
            () => motorPositionController.getAcceleration(),
            'getAcceleration',
          );
          msg.payload = { Acceleration };
          node.send(msg);
          break;
        }
        case 'setAcceleration': {
          invokeMethod(
            () => motorPositionController.setAcceleration(msg.payload?.acceleration),
            'setAcceleration',
          );
          break;
        }
        case 'getMinAcceleration': {
          const MinAcceleration = invokeMethod(
            () => motorPositionController.getMinAcceleration(),
            'getMinAcceleration',
          );
          msg.payload = { MinAcceleration };
          node.send(msg);
          break;
        }
        case 'getMaxAcceleration': {
          const MaxAcceleration = invokeMethod(
            () => motorPositionController.getMaxAcceleration(),
            'getMaxAcceleration',
          );
          msg.payload = { MaxAcceleration };
          node.send(msg);
          break;
        }
        case 'getCurrentLimit': {
          const CurrentLimit = invokeMethod(
            () => motorPositionController.getCurrentLimit(),
            'getCurrentLimit',
          );
          msg.payload = { CurrentLimit };
          node.send(msg);
          break;
        }
        case 'setCurrentLimit': {
          invokeMethod(
            () => motorPositionController.setCurrentLimit(msg.payload?.currentLimit),
            'setCurrentLimit',
          );
          break;
        }
        case 'getMinCurrentLimit': {
          const MinCurrentLimit = invokeMethod(
            () => motorPositionController.getMinCurrentLimit(),
            'getMinCurrentLimit',
          );
          msg.payload = { MinCurrentLimit };
          node.send(msg);
          break;
        }
        case 'getMaxCurrentLimit': {
          const MaxCurrentLimit = invokeMethod(
            () => motorPositionController.getMaxCurrentLimit(),
            'getMaxCurrentLimit',
          );
          msg.payload = { MaxCurrentLimit };
          node.send(msg);
          break;
        }
        case 'getCurrentRegulatorGain': {
          const CurrentRegulatorGain = invokeMethod(
            () => motorPositionController.getCurrentRegulatorGain(),
            'getCurrentRegulatorGain',
          );
          msg.payload = { CurrentRegulatorGain };
          node.send(msg);
          break;
        }
        case 'setCurrentRegulatorGain': {
          invokeMethod(
            () =>
              motorPositionController.setCurrentRegulatorGain(msg.payload?.currentRegulatorGain),
            'setCurrentRegulatorGain',
          );
          break;
        }
        case 'getMinCurrentRegulatorGain': {
          const MinCurrentRegulatorGain = invokeMethod(
            () => motorPositionController.getMinCurrentRegulatorGain(),
            'getMinCurrentRegulatorGain',
          );
          msg.payload = { MinCurrentRegulatorGain };
          node.send(msg);
          break;
        }
        case 'getMaxCurrentRegulatorGain': {
          const MaxCurrentRegulatorGain = invokeMethod(
            () => motorPositionController.getMaxCurrentRegulatorGain(),
            'getMaxCurrentRegulatorGain',
          );
          msg.payload = { MaxCurrentRegulatorGain };
          node.send(msg);
          break;
        }
        case 'getDataInterval': {
          const DataInterval = invokeMethod(
            () => motorPositionController.getDataInterval(),
            'getDataInterval',
          );
          msg.payload = { DataInterval };
          node.send(msg);
          break;
        }
        case 'setDataInterval': {
          invokeMethod(
            () => motorPositionController.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'getMinDataInterval': {
          const MinDataInterval = invokeMethod(
            () => motorPositionController.getMinDataInterval(),
            'getMinDataInterval',
          );
          msg.payload = { MinDataInterval };
          node.send(msg);
          break;
        }
        case 'getMaxDataInterval': {
          const MaxDataInterval = invokeMethod(
            () => motorPositionController.getMaxDataInterval(),
            'getMaxDataInterval',
          );
          msg.payload = { MaxDataInterval };
          node.send(msg);
          break;
        }
        case 'getDeadBand': {
          const DeadBand = invokeMethod(() => motorPositionController.getDeadBand(), 'getDeadBand');
          msg.payload = { DeadBand };
          node.send(msg);
          break;
        }
        case 'setDeadBand': {
          invokeMethod(
            () => motorPositionController.setDeadBand(msg.payload?.deadBand),
            'setDeadBand',
          );
          break;
        }
        case 'getDutyCycle': {
          const DutyCycle = invokeMethod(
            () => motorPositionController.getDutyCycle(),
            'getDutyCycle',
          );
          msg.payload = { DutyCycle };
          node.send(msg);
          break;
        }
        case 'getEngaged': {
          const Engaged = invokeMethod(() => motorPositionController.getEngaged(), 'getEngaged');
          msg.payload = { Engaged };
          node.send(msg);
          break;
        }
        case 'setEngaged': {
          invokeMethod(
            () => motorPositionController.setEngaged(msg.payload?.engaged),
            'setEngaged',
          );
          break;
        }
        case 'enableFailsafe': {
          invokeMethod(
            () => motorPositionController.enableFailsafe(msg.payload?.failsafeTime),
            'enableFailsafe',
          );
          break;
        }
        case 'getMinFailsafeTime': {
          const MinFailsafeTime = invokeMethod(
            () => motorPositionController.getMinFailsafeTime(),
            'getMinFailsafeTime',
          );
          msg.payload = { MinFailsafeTime };
          node.send(msg);
          break;
        }
        case 'getMaxFailsafeTime': {
          const MaxFailsafeTime = invokeMethod(
            () => motorPositionController.getMaxFailsafeTime(),
            'getMaxFailsafeTime',
          );
          msg.payload = { MaxFailsafeTime };
          node.send(msg);
          break;
        }
        case 'getFanMode': {
          const FanMode = invokeMethod(() => motorPositionController.getFanMode(), 'getFanMode');
          msg.payload = { FanMode };
          node.send(msg);
          break;
        }
        case 'setFanMode': {
          invokeMethod(
            () => motorPositionController.setFanMode(msg.payload?.fanMode),
            'setFanMode',
          );
          break;
        }
        case 'getIOMode': {
          const IOMode = invokeMethod(() => motorPositionController.getIOMode(), 'getIOMode');
          msg.payload = { IOMode };
          node.send(msg);
          break;
        }
        case 'setIOMode': {
          invokeMethod(() => motorPositionController.setIOMode(msg.payload?.IOMode), 'setIOMode');
          break;
        }
        case 'getKd': {
          const Kd = invokeMethod(() => motorPositionController.getKd(), 'getKd');
          msg.payload = { Kd };
          node.send(msg);
          break;
        }
        case 'setKd': {
          invokeMethod(() => motorPositionController.setKd(msg.payload?.kd), 'setKd');
          break;
        }
        case 'getKi': {
          const Ki = invokeMethod(() => motorPositionController.getKi(), 'getKi');
          msg.payload = { Ki };
          node.send(msg);
          break;
        }
        case 'setKi': {
          invokeMethod(() => motorPositionController.setKi(msg.payload?.ki), 'setKi');
          break;
        }
        case 'getKp': {
          const Kp = invokeMethod(() => motorPositionController.getKp(), 'getKp');
          msg.payload = { Kp };
          node.send(msg);
          break;
        }
        case 'setKp': {
          invokeMethod(() => motorPositionController.setKp(msg.payload?.kp), 'setKp');
          break;
        }
        case 'getPosition': {
          const Position = invokeMethod(() => motorPositionController.getPosition(), 'getPosition');
          msg.payload = { Position };
          node.send(msg);
          break;
        }
        case 'getMinPosition': {
          const MinPosition = invokeMethod(
            () => motorPositionController.getMinPosition(),
            'getMinPosition',
          );
          msg.payload = { MinPosition };
          node.send(msg);
          break;
        }
        case 'getMaxPosition': {
          const MaxPosition = invokeMethod(
            () => motorPositionController.getMaxPosition(),
            'getMaxPosition',
          );
          msg.payload = { MaxPosition };
          node.send(msg);
          break;
        }
        case 'addPositionOffset': {
          invokeMethod(
            () => motorPositionController.addPositionOffset(msg.payload?.positionOffset),
            'addPositionOffset',
          );
          break;
        }
        case 'getRescaleFactor': {
          const RescaleFactor = invokeMethod(
            () => motorPositionController.getRescaleFactor(),
            'getRescaleFactor',
          );
          msg.payload = { RescaleFactor };
          node.send(msg);
          break;
        }
        case 'setRescaleFactor': {
          invokeMethod(
            () => motorPositionController.setRescaleFactor(msg.payload?.rescaleFactor),
            'setRescaleFactor',
          );
          break;
        }
        case 'resetFailsafe': {
          invokeMethod(() => motorPositionController.resetFailsafe(), 'resetFailsafe');
          break;
        }
        case 'getStallVelocity': {
          const StallVelocity = invokeMethod(
            () => motorPositionController.getStallVelocity(),
            'getStallVelocity',
          );
          msg.payload = { StallVelocity };
          node.send(msg);
          break;
        }
        case 'setStallVelocity': {
          invokeMethod(
            () => motorPositionController.setStallVelocity(msg.payload?.stallVelocity),
            'setStallVelocity',
          );
          break;
        }
        case 'getMinStallVelocity': {
          const MinStallVelocity = invokeMethod(
            () => motorPositionController.getMinStallVelocity(),
            'getMinStallVelocity',
          );
          msg.payload = { MinStallVelocity };
          node.send(msg);
          break;
        }
        case 'getMaxStallVelocity': {
          const MaxStallVelocity = invokeMethod(
            () => motorPositionController.getMaxStallVelocity(),
            'getMaxStallVelocity',
          );
          msg.payload = { MaxStallVelocity };
          node.send(msg);
          break;
        }
        case 'getTargetPosition': {
          const TargetPosition = invokeMethod(
            () => motorPositionController.getTargetPosition(),
            'getTargetPosition',
          );
          msg.payload = { TargetPosition };
          node.send(msg);
          break;
        }
        case 'setTargetPosition': {
          invokeMethod(
            () => motorPositionController.setTargetPosition(msg.payload?.targetPosition),
            'setTargetPosition',
          );
          break;
        }
        case 'getVelocityLimit': {
          const VelocityLimit = invokeMethod(
            () => motorPositionController.getVelocityLimit(),
            'getVelocityLimit',
          );
          msg.payload = { VelocityLimit };
          node.send(msg);
          break;
        }
        case 'setVelocityLimit': {
          invokeMethod(
            () => motorPositionController.setVelocityLimit(msg.payload?.velocityLimit),
            'setVelocityLimit',
          );
          break;
        }
        case 'getMinVelocityLimit': {
          const MinVelocityLimit = invokeMethod(
            () => motorPositionController.getMinVelocityLimit(),
            'getMinVelocityLimit',
          );
          msg.payload = { MinVelocityLimit };
          node.send(msg);
          break;
        }
        case 'getMaxVelocityLimit': {
          const MaxVelocityLimit = invokeMethod(
            () => motorPositionController.getMaxVelocityLimit(),
            'getMaxVelocityLimit',
          );
          msg.payload = { MaxVelocityLimit };
          node.send(msg);
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-motorpositioncontroller', Phidget22MotorPositionControllerNode);
};
