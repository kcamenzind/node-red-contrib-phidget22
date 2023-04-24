import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import { PhidgetNodeConfig } from './common';

type ConnectNodeExtraConfig = {
  hostname: string;
  port: string;
  retry?: boolean;
};

// To default to previous behavior before this was an option.
const DEFAULT_RETRY_ON_FAIL = false;

type ConnectNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & ConnectNodeExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22ConnectNode(this: nodeRED.Node, config: ConnectNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.status({ fill: 'green', shape: 'ring', text: 'connecting' });

    try {
      const conn = new phidget22.NetworkConnection(parseInt(config.port), config.hostname);

      conn.onAuthenticationNeeded = () => {
        const msg = { topic: 'AuthenticationNeeded', payload: {} };
        node.send(msg);
        // The type on onAuthenticationNeeded from phidget22 package may be wrong; doesn't allow null.
        return '';
      };

      conn.onConnect = () => {
        const msg = { topic: 'Connect', payload: {} };
        node.status({ fill: 'green', shape: 'dot', text: 'connected' });
        node.send(msg);
      };

      conn.onDisconnect = () => {
        const msg = { topic: 'Disconnect', payload: {} };
        node.status({ fill: 'red', shape: 'ring', text: 'disconnected' });
        node.send(msg);
      };

      conn.onError = (code, errMsg) => {
        const msg = { topic: 'Error', payload: { code, msg: errMsg } };
        node.send(msg);
      };

      if (config.debug) {
        node.warn(`Attempting to Connect to Server (${config.hostname}:${config.port})`);
      }

      conn
        .connect(config.retry || DEFAULT_RETRY_ON_FAIL)
        .then(() => {
          if (config.debug) {
            node.warn(`Connect Success (${config.hostname}:${config.port})`);
          }
          node.status({ fill: 'green', shape: 'dot', text: 'connected' });
        })
        .catch((err) => {
          node.error('Connect failed: ' + err);
          node.status({ fill: 'red', shape: 'dot', text: 'connect failed' });
        });

      node.on('close', (done: (err?: any) => void) => {
        try {
          conn.close();
          conn.delete();
          node.status({ fill: 'green', shape: 'ring', text: 'closed' });
          done();
        } catch (err) {
          node.status({ fill: 'red', shape: 'ring', text: 'disconnect failed' });
          done(err);
        }
      });
    } catch (err) {
      node.error('error creating connection: ' + err);
      node.status({ fill: 'red', shape: 'dot', text: 'error' });
    }
  }
  RED.nodes.registerType('phidget22-connect', Phidget22ConnectNode);

  RED.httpAdmin.get('/phidget22/js/*', function (req, res) {
    const options = {
      root: __dirname + '/static/',
      dotfiles: 'deny',
    };
    const filename: string = (req.params as any)[0];
    res.sendFile(filename, options);
  });
};
