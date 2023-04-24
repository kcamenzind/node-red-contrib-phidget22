import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type CapacitiveTouchNodeExtraConfig = {
  dataInterval: number;
  touchValueChangeTrigger: number;
};

type CapacitiveTouchNodeConfig = nodeRED.NodeDef &
  PhidgetNodeConfig &
  CapacitiveTouchNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22CapacitiveTouchNode(this: nodeRED.Node, config: CapacitiveTouchNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const capacitiveTouch = new phidget22.CapacitiveTouch();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    capacitiveTouch.onAttach = () => {
      invokeMethod(
        () => capacitiveTouch.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => capacitiveTouch.setTouchValueChangeTrigger(config.touchValueChangeTrigger),
        'setTouchValueChangeTrigger (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    capacitiveTouch.onTouch = (touchValue) => {
      const msg = { topic: 'Touch', payload: { touchValue } };
      node.send(msg);
    };

    capacitiveTouch.onTouchEnd = () => {
      const msg = { topic: 'TouchEnd', payload: {} };
      node.send(msg);
    };

    setupPhidgetDevice(capacitiveTouch, node, config);
    openPhidgetDevice(capacitiveTouch, 'CapacitiveTouch', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setDataInterval': {
          invokeMethod(
            () => capacitiveTouch.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setSensitivity': {
          invokeMethod(
            () => capacitiveTouch.setSensitivity(msg.payload?.sensitivity),
            'setSensitivity',
          );
          break;
        }
        case 'setTouchValueChangeTrigger': {
          invokeMethod(
            () => capacitiveTouch.setTouchValueChangeTrigger(msg.payload?.touchValueChangeTrigger),
            'setTouchValueChangeTrigger',
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
  RED.nodes.registerType('phidget22-capacitivetouch', Phidget22CapacitiveTouchNode);
};
