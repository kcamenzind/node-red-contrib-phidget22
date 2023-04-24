import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type DictionaryNodeExtraConfig = {
  label: string;
};
type DictionaryNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & DictionaryNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22DictionaryNode(this: nodeRED.Node, config: DictionaryNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const dictionary = new phidget22.Dictionary();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    if (config.label !== '') dictionary.setDeviceLabel(config.label);

    dictionary.onAttach = () => {
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    dictionary.onAdd = (key, value) => {
      const msg = { topic: 'Add', payload: { key, value } };
      node.send(msg);
    };

    dictionary.onRemove = (key) => {
      const msg = { topic: 'Remove', payload: { key } };
      node.send(msg);
    };

    dictionary.onUpdate = (key, value) => {
      const msg = { topic: 'Update', payload: { key, value } };
      node.send(msg);
    };

    setupPhidgetDevice(dictionary, node, config);
    openPhidgetDevice(dictionary, 'Dictionary', node, state, config);

    node.on('input', async (msg: any) => {
      switch (msg.topic) {
        case 'add': {
          invokeMethod(() => dictionary.add(msg.payload?.key, msg.payload?.value), 'add');
          break;
        }
        case 'get': {
          const value = await invokeMethod(
            () => dictionary.get(msg.payload.key, msg.payload.def),
            'get',
          );
          msg.payload = { value };
          node.send(msg);
          break;
        }
        case 'removeAll': {
          invokeMethod(() => dictionary.removeAll(), 'removeAll');
          break;
        }
        case 'remove': {
          invokeMethod(() => dictionary.remove(msg.payload.key), 'remove');
          break;
        }
        case 'scan': {
          const keyList = await invokeMethod(() => dictionary.scan(msg.payload.start), 'scan');
          msg.payload = { keyList };
          node.send(msg);
          break;
        }
        case 'set': {
          invokeMethod(() => dictionary.set(msg.payload.key, msg.payload.value), 'set');
          break;
        }
        case 'update': {
          invokeMethod(() => dictionary.update(msg.payload.key, msg.payload.value), 'update');
          break;
        }
        default: {
          node.error('Unsupported message topic: ' + msg.topic);
          break;
        }
      }
    });
  }
  RED.nodes.registerType('phidget22-dictionary', Phidget22DictionaryNode);
};
