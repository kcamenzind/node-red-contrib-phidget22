import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type DCMotorNodeExtraConfig = {
  dataInterval: number;
  backEMFSensingState: boolean;
  fanMode: phidget22.FanMode;
  targetBrakingStrength: number;
  currentLimit: number;
  acceleration: number;
  currentRegulatorGain: number;
};
type DCMotorNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & DCMotorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22DCMotorNode(this: nodeRED.Node, config: DCMotorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const dcMotor = new phidget22.DCMotor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    dcMotor.onAttach = () => {
      invokeMethod(
        () => dcMotor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => dcMotor.setBackEMFSensingState(config.backEMFSensingState),
        'setBackEMFSensingState (in onAttach)',
      );
      invokeMethod(
        () => dcMotor.setAcceleration(config.acceleration),
        'setAcceleration (in onAttach)',
      );
      invokeMethod(
        () => dcMotor.setCurrentLimit(config.currentLimit),
        'setCurrentLimit (in onAttach)',
      );
      invokeMethod(
        () => dcMotor.setCurrentRegulatorGain(config.currentRegulatorGain),
        'setCurrentRegulatorGain',
      );
      invokeMethod(
        () => dcMotor.setTargetBrakingStrength(config.targetBrakingStrength),
        'setTargetBrakingStrength',
      );
      invokeMethod(() => dcMotor.setFanMode(config.fanMode), 'setFanMode');
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    dcMotor.onBackEMFChange = (backEMF) => {
      const msg = { topic: 'BackEMFChange', payload: { backEMF } };
      node.send(msg);
    };

    dcMotor.onBrakingStrengthChange = (brakingStrength) => {
      const msg = {
        topic: 'BrakingStrengthChange',
        payload: { brakingStrength },
      };
      node.send(msg);
    };

    dcMotor.onVelocityUpdate = (velocity) => {
      const msg = { topic: 'VelocityUpdate', payload: { velocity } };
      node.send(msg);
    };

    setupPhidgetDevice(dcMotor, node, config);
    openPhidgetDevice(dcMotor, 'DCMotor', node, state, config);

    node.on('input', async (msg: any) => {
      switch (msg.topic) {
        case 'getAcceleration': {
          const Acceleration = await invokeMethod(
            () => dcMotor.getAcceleration(),
            'getAcceleration',
          );
          msg.payload = { Acceleration };
          node.send(msg);
          break;
        }
        case 'setAcceleration': {
          invokeMethod(() => dcMotor.setAcceleration(msg.payload?.acceleration), 'setAcceleration');
          break;
        }
        case 'getMinAcceleration': {
          const MinAcceleration = await invokeMethod(
            () => dcMotor.getMinAcceleration(),
            'getMinAcceleration',
          );
          msg.payload = { MinAcceleration };
          node.send(msg);
          break;
        }
        case 'getMaxAcceleration': {
          const MaxAcceleration = await invokeMethod(
            () => dcMotor.getMaxAcceleration(),
            'getMaxAcceleration',
          );
          msg.payload = { MaxAcceleration };
          node.send(msg);
          break;
        }
        case 'getBackEMF': {
          const BackEMF = await invokeMethod(() => dcMotor.getBackEMF(), 'getBackEMF');
          msg.payload = { BackEMF };
          node.send(msg);
          break;
        }
        case 'getBackEMFSensingState': {
          const BackEMFSensingState = await invokeMethod(
            () => dcMotor.getBackEMFSensingState(),
            'getBackEMFSensingState',
          );
          msg.payload = { BackEMFSensingState };
          node.send(msg);
          break;
        }
        case 'setBackEMFSensingState': {
          invokeMethod(
            () => dcMotor.setBackEMFSensingState(msg.payload?.backEMFSensingState),
            'setBackEMFSensingState',
          );
          break;
        }
        case 'getBrakingStrength': {
          const BrakingStrength = await invokeMethod(
            () => dcMotor.getBrakingStrength(),
            'getBrakingStrength',
          );
          msg.payload = { BrakingStrength };
          node.send(msg);
          break;
        }
        case 'getMinBrakingStrength': {
          const MinBrakingStrength = await invokeMethod(
            () => dcMotor.getMinBrakingStrength(),
            'getMinBrakingStrength',
          );
          msg.payload = { MinBrakingStrength };
          break;
        }
        case 'getMaxBrakingStrength': {
          const MaxBrakingStrength = await invokeMethod(
            () => dcMotor.getMaxBrakingStrength(),
            'getMaxBrakingStrength',
          );
          msg.payload = { MaxBrakingStrength };
          node.send(msg);
          break;
        }
        case 'getCurrentLimit': {
          const CurrentLimit = await invokeMethod(
            () => dcMotor.getCurrentLimit(),
            'getCurrentLimit',
          );
          msg.payload = { CurrentLimit };
          node.send(msg);
          break;
        }
        case 'setCurrentLimit': {
          invokeMethod(() => dcMotor.setCurrentLimit(msg.payload?.currentLimit), 'setCurrentLimit');
          break;
        }
        case 'getMinCurrentLimit': {
          const MinCurrentLimit = await invokeMethod(
            () => dcMotor.getMinCurrentLimit(),
            'getMinCurrentLimit',
          );
          msg.payload = { MinCurrentLimit };
          node.send(msg);
          break;
        }
        case 'getMaxCurrentLimit': {
          const MaxCurrentLimit = await invokeMethod(
            () => dcMotor.getMaxCurrentLimit(),
            'getMaxCurrentLimit',
          );
          msg.payload = { MaxCurrentLimit };
          node.send(msg);
          break;
        }
        case 'getCurrentRegulatorGain': {
          const CurrentRegulatorGain = await invokeMethod(
            () => dcMotor.getCurrentRegulatorGain(),
            'getCurrentRegulatorGain',
          );
          msg.payload = { CurrentRegulatorGain };
          node.send(msg);
          break;
        }
        case 'setCurrentRegulatorGain': {
          invokeMethod(
            () => dcMotor.setCurrentRegulatorGain(msg.payload?.currentRegulatorGain),
            'setCurrentRegulatorGain',
          );
          break;
        }
        case 'getMinCurrentRegulatorGain': {
          const MinCurrentRegulatorGain = await invokeMethod(
            () => dcMotor.getMinCurrentRegulatorGain(),
            'getMinCurrentRegulatorGain',
          );
          msg.payload = { MinCurrentRegulatorGain };
          node.send(msg);
          break;
        }
        case 'getMaxCurrentRegulatorGain': {
          const MaxCurrentRegulatorGain = await invokeMethod(
            () => dcMotor.getMaxCurrentRegulatorGain(),
            'getMaxCurrentRegulatorGain',
          );
          msg.payload = { MaxCurrentRegulatorGain };
          node.send(msg);
          break;
        }
        case 'getDataInterval': {
          const DataInterval = await invokeMethod(
            () => dcMotor.getDataInterval(),
            'getDataInterval',
          );
          msg.payload = { DataInterval };
          node.send(msg);
          break;
        }
        case 'setDataInterval': {
          invokeMethod(() => dcMotor.setDataInterval(msg.payload?.dataInterval), 'setDataInterval');
          break;
        }
        case 'getMinDataInterval': {
          const MinDataInterval = await invokeMethod(
            () => dcMotor.getMinDataInterval(),
            'getMinDataInterval',
          );
          msg.payload = { MinDataInterval };
          node.send(msg);
          break;
        }
        case 'getMaxDataInterval': {
          const MaxDataInterval = await invokeMethod(
            () => dcMotor.getMaxDataInterval(),
            'getMaxDataInterval',
          );
          msg.payload = { MaxDataInterval };
          node.send(msg);
          break;
        }
        case 'enableFailsafe': {
          invokeMethod(() => dcMotor.enableFailsafe(msg.payload?.failsafeTime), 'enableFailsafe');
          break;
        }
        case 'getMinFailsafeTime': {
          const MinFailsafeTime = await invokeMethod(
            () => dcMotor.getMinFailsafeTime(),
            'getMinFailsafeTime',
          );
          msg.payload = { MinFailsafeTime };
          node.send(msg);
          break;
        }
        case 'getMaxFailsafeTime': {
          const MaxFailsafeTime = await invokeMethod(
            () => dcMotor.getMaxFailsafeTime(),
            'getMaxFailsafeTime',
          );
          msg.payload = { MaxFailsafeTime };
          node.send(msg);
          break;
        }
        case 'resetFailsafe': {
          invokeMethod(() => dcMotor.resetFailsafe(), 'resetFailsafe');
          break;
        }
        case 'getFanMode': {
          const FanMode = await invokeMethod(() => dcMotor.getFanMode(), 'getFanMode');
          msg.payload = { FanMode };
          node.send(msg);
          break;
        }
        case 'setFanMode': {
          invokeMethod(() => dcMotor.setFanMode(msg.payload?.fanMode), 'setFanMode');
          break;
        }
        case 'getTargetBrakingStrength': {
          const TargetBrakingStrength = await invokeMethod(
            () => dcMotor.getTargetBrakingStrength(),
            'getTargetBrakingStrength',
          );
          msg.payload = { TargetBrakingStrength };
          node.send(msg);
          break;
        }
        case 'setTargetBrakingStrength': {
          invokeMethod(
            () => dcMotor.setTargetBrakingStrength(msg.payload?.targetBrakingStrength),
            'setTargetBrakingStrength',
          );
          break;
        }
        case 'getTargetVelocity': {
          const TargetVelocity = await invokeMethod(
            () => dcMotor.getTargetVelocity(),
            'getTargetVelocity',
          );
          msg.payload = { TargetVelocity };
          node.send(msg);
          break;
        }
        case 'setTargetVelocity': {
          invokeMethod(
            () => dcMotor.setTargetVelocity(msg.payload?.targetVelocity),
            'setTargetVelocity',
          );
          break;
        }
        case 'getVelocity': {
          const Velocity = await invokeMethod(() => dcMotor.getVelocity(), 'getVelocity');
          msg.payload = { Velocity };
          node.send(msg);
          break;
        }
        case 'getMinVelocity': {
          const MinVelocity = await invokeMethod(() => dcMotor.getMinVelocity(), 'getMinVelocity');
          msg.payload = { MinVelocity };
          node.send(msg);
          break;
        }
        case 'getMaxVelocity': {
          const MaxVelocity = await invokeMethod(() => dcMotor.getMaxVelocity(), 'getMaxVelocity');
          msg.payload = { MaxVelocity };
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
  RED.nodes.registerType('phidget22-dcmotor', Phidget22DCMotorNode);
};
