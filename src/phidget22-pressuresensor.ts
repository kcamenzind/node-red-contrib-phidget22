import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type PressureSensorNodeExtraConfig = {
  dataInterval: number;
  pressureChangeTrigger: number;
};
type PressureSensorNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & PressureSensorNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22PressureSensorNode(this: nodeRED.Node, config: PressureSensorNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };

    const pressureSensor = new phidget22.PressureSensor();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    pressureSensor.onAttach = () => {
      invokeMethod(
        () => pressureSensor.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => pressureSensor.setPressureChangeTrigger(config.pressureChangeTrigger),
        'setPressureChangeTrigger (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    pressureSensor.onPressureChange = (pressure) => {
      const msg = { topic: 'PressureChange', payload: { pressure } };
      node.send(msg);
    };

    setupPhidgetDevice(pressureSensor, node, config);
    openPhidgetDevice(pressureSensor, 'PressureSensor', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInterval': {
          invokeMethod(
            () => pressureSensor.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setPressureChangeTrigger': {
          invokeMethod(
            () => pressureSensor.setPressureChangeTrigger(msg.payload?.pressureChangeTrigger),
            'setPressureChangeTrigger',
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
  RED.nodes.registerType('phidget22-pressuresensor', Phidget22PressureSensorNode);
};
