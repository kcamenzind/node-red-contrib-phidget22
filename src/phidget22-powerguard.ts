import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type PowerGuardNodeExtraConfig = {
  fanMode: phidget22.FanMode;
  overVoltage: number;
};
type PowerGuardNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & PowerGuardNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22PowerGuardNode(this: nodeRED.Node, config: PowerGuardNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const powerGuard = new phidget22.PowerGuard();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    powerGuard.onAttach = () => {
      invokeMethod(() => powerGuard.setFanMode(config.fanMode), 'setFanMode (in onAttach)');
      invokeMethod(
        () => powerGuard.setOverVoltage(config.overVoltage),
        'setOverVoltage (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    setupPhidgetDevice(powerGuard, node, config);
    openPhidgetDevice(powerGuard, 'PowerGuard', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'enableFailsafe': {
          invokeMethod(
            () => powerGuard.enableFailsafe(msg.payload?.failsafeTime),
            'enableFailsafe',
          );
          break;
        }
        case 'setFanMode': {
          invokeMethod(() => powerGuard.setFanMode(msg.payload?.fanMode), 'setFanMode');
          break;
        }
        case 'setOverVoltage': {
          invokeMethod(() => powerGuard.setOverVoltage(msg.payload?.overVoltage), 'setOverVoltage');
          break;
        }
        case 'setPowerEnabled': {
          invokeMethod(
            () => powerGuard.setPowerEnabled(msg.payload?.powerEnabled),
            'setPowerEnabled',
          );
          break;
        }
        case 'resetFailsafe': {
          invokeMethod(() => powerGuard.resetFailsafe(), 'resetFailsafe');
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-powerguard', Phidget22PowerGuardNode);
};
