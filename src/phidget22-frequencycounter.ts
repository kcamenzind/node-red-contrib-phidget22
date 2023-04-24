import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type FrequencyCounterNodeExtraConfig = {
  dataInterval: number;
  powerSupply: phidget22.PowerSupply;
  inputMode: phidget22.InputMode;
  filterType: phidget22.FrequencyFilterType;
  frequencyCutoff: number;
};
type FrequencyCounterNodeConfig = nodeRED.NodeDef &
  PhidgetNodeConfig &
  FrequencyCounterNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22FrequencyCounterNode(this: nodeRED.Node, config: FrequencyCounterNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const frequencyCounter = new phidget22.FrequencyCounter();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    frequencyCounter.onAttach = () => {
      invokeMethod(
        () => frequencyCounter.setDataInterval(config.dataInterval),
        'setDataInterval (in onAttach)',
      );
      invokeMethod(
        () => frequencyCounter.setFrequencyCutoff(config.frequencyCutoff),
        'setFrequencyCutoff (in onAttach)',
      );
      invokeMethod(
        () => frequencyCounter.setFilterType(config.filterType),
        'setFilterType (in onAttach)',
      );
      invokeMethod(
        () => frequencyCounter.setInputMode(config.inputMode),
        'setInputMode (in onAttach)',
      );
      invokeMethod(
        () => frequencyCounter.setPowerSupply(config.powerSupply),
        'setPowerSupply (in onAttach)',
      );
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    frequencyCounter.onCountChange = (counts, timeChange) => {
      const msg = {
        topic: 'CountChange',
        payload: { counts, timeChange },
      };
      node.send(msg);
    };

    frequencyCounter.onFrequencyChange = (frequency) => {
      const msg = {
        topic: 'FrequencyChange',
        payload: { frequency: frequency },
      };
      node.send(msg);
    };

    setupPhidgetDevice(frequencyCounter, node, config);
    openPhidgetDevice(frequencyCounter, 'FrequencyCounter', node, state, config);

    node.on('input', (msg: any) => {
      switch (msg.topic) {
        case 'setEnabled': {
          invokeMethod(() => frequencyCounter.setEnabled(msg.payload?.enabled), 'setEnabled');
          break;
        }
        case 'setDataInterval': {
          invokeMethod(
            () => frequencyCounter.setDataInterval(msg.payload?.dataInterval),
            'setDataInterval',
          );
          break;
        }
        case 'setFilterType': {
          invokeMethod(
            () => frequencyCounter.setFilterType(msg.payload?.filterType),
            'setFilterType',
          );
          break;
        }
        case 'setFrequencyCutoff': {
          invokeMethod(
            () => frequencyCounter.setFrequencyCutoff(msg.payload?.frequencyCutoff),
            'setFrequencyCutoff',
          );
          break;
        }
        case 'setInputMode': {
          invokeMethod(() => frequencyCounter.setInputMode(msg.payload?.inputMode), 'setInputMode');
          break;
        }
        case 'setPowerSupply': {
          invokeMethod(
            () => frequencyCounter.setPowerSupply(msg.payload?.powerSupply),
            'setPowerSupply',
          );
          break;
        }
        case 'reset': {
          invokeMethod(() => frequencyCounter.reset(), 'reset');
          break;
        }

        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-frequencycounter', Phidget22FrequencyCounterNode);
};
