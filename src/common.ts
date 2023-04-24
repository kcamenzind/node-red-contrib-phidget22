import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

enum PhidgetEvent {
  ATTACH = 'Attach',
  DETACH = 'Detach',
  ERROR = 'Error',
  PROPERTY_CHANGE = 'PropertyChange',
}

// Matches the previous node behavior before there was a timeout option.
const DEFAULT_PHIDGET_OPEN_TIMEOUT = 5000;

export type PhidgetNodeConfig = nodeRED.NodeDef & {
  name: string;
  deviceSerialNumber: number;
  channel?: number;
  hubPort?: number;
  isHubPortDevice?: boolean;
  debug: boolean;
  openTimeout?: number;
};

export const isUnsupportedPhidgetError = (err: any): boolean => {
  return err instanceof phidget22.PhidgetError && err.errorCode == phidget22.ErrorCode.UNSUPPORTED;
};

export const isUnexpectedPhidgetError = (err: any): boolean => {
  return err instanceof phidget22.PhidgetError && err.errorCode == phidget22.ErrorCode.UNEXPECTED;
};

export const phidgetMethodErrorHandler = (
  err: any,
  label: string,
  node: nodeRED.Node,
  debug: boolean,
): void => {
  if (isUnsupportedPhidgetError(err)) {
    if (debug) node.warn(`${label} not supported`);
  } else {
    node.error(`${label} failed: ` + err);
  }
};

export function getInvokePhidgetMethod(node: nodeRED.Node, debug: boolean) {
  return async function <TMethodResponse>(
    method: () => TMethodResponse | Promise<TMethodResponse>,
    label: string,
  ): Promise<TMethodResponse | undefined> {
    try {
      const response = await method();
      if (debug) {
        node.warn(`${label} success`);
      }
      return response;
    } catch (err) {
      phidgetMethodErrorHandler(err, label, node, debug);
    }
  };
}

/**
 * Does the common setup for a phidgets device. This includes:
 * - Setting the parameters of the device to attach to (hub port, serial number, channel).
 * - Setting handlers for common events: onDetach, onError, onPropertyChange.
 * - Setting the node onClose handler (will close the phidgets device).
 * @param phidget - The phidgets device.
 * @param node - The Node-RED node object.
 * @param {number} [config.channel] - The phidgets channel.
 * @param {number} config.deviceSerialNumber - The phidgets device serial number. -1 if any.
 * @param {number} [config.hubPort] - The hub port the phidgets device is plugged into.
 * @param {boolean} [config.isHubPortDevice] - Whether this device is a hub port device.
 */
export const setupPhidgetDevice = (
  phidget: phidget22.Phidget,
  node: nodeRED.Node,
  config: PhidgetNodeConfig,
) => {
  // Common/required configuration.
  phidget.setDeviceSerialNumber(config.deviceSerialNumber);

  // Optional configuration depending on device type.
  if (config.channel !== undefined) {
    phidget.setChannel(config.channel);
  }
  if (config.hubPort !== undefined) {
    phidget.setHubPort(config.hubPort);
  }
  if (config.isHubPortDevice !== undefined) {
    phidget.setIsHubPortDevice(config.isHubPortDevice);
  }

  // Handlers for events.
  phidget.onDetach = () => {
    const msg = { topic: PhidgetEvent.DETACH, payload: {} };
    node.status({ fill: 'red', shape: 'ring', text: 'detached' });
    node.send(msg);
  };

  phidget.onError = (code, description) => {
    const msg = {
      topic: PhidgetEvent.ERROR,
      payload: { code, description },
    };
    node.send(msg);
  };

  phidget.onPropertyChange = (propertyName) => {
    const msg = {
      topic: PhidgetEvent.PROPERTY_CHANGE,
      payload: { propertyName },
    };
    node.send(msg);
  };

  // Node close handler. Waits for device to close before invoking done callback.
  node.on('close', async (done: (err: Error | void) => void) => {
    try {
      await phidget.close();
      node.status({ fill: 'green', shape: 'ring', text: 'closed' });
      done();
    } catch (err: any) {
      if (isUnexpectedPhidgetError(err)) {
        // Ignore error code 28: occurs when the connection closes before this node
        node.debug('closed failed, ignoring: ' + err);
        node.status({ fill: 'green', shape: 'ring', text: 'closed' });
        done();
      } else {
        node.error('close failed: ' + err);
        node.status({ fill: 'red', shape: 'ring', text: 'close failed' });
        done(err);
      }
    }
  });
};

/**
 * Opens the phidget device.
 * @param {Phidget} phidget - The phidgets device.
 * @param {string} phidgetName - The display name for this phidget device type.
 * @param {Node} node - The Node-RED node object.
 * @param {number} [config.channel] - The phidgets channel.
 * @param {boolean} config.debug - Whether to print debug messages when the device is being sopened.
 * @param {number} config.deviceSerialNumber - The phidgets device serial number. -1 if any.
 * @param {number} [config.openTimeout] - The timeout for open. Defaults to 5 seconds.
 */
export const openPhidgetDevice = (
  phidget: phidget22.Phidget,
  phidgetName: string,
  node: nodeRED.Node,
  state: { didAttach: boolean },
  config: PhidgetNodeConfig,
) => {
  node.status({ fill: 'green', shape: 'ring', text: 'opening' });
  const openTimeout: number =
    config.openTimeout === undefined ? DEFAULT_PHIDGET_OPEN_TIMEOUT : config.openTimeout;

  if (config.debug)
    node.warn(
      `Attempting to Open ${phidgetName} (SN: ${config.deviceSerialNumber}, Ch: ${config.channel})`,
    );

  phidget
    .open(openTimeout)
    .then(() => {
      if (config.debug) {
        if (config.channel) {
          node.warn(
            `${phidgetName} Opened (SN: ${config.deviceSerialNumber}, Ch: ${config.channel})`,
          );
        } else {
          node.warn(`${phidgetName} Opened (SN: ${config.deviceSerialNumber})`);
        }
      }
      if (!state.didAttach) {
        // don't overwrite attached status if attach cb fired before open
        node.status({ fill: 'green', shape: 'ring', text: 'open' });
      }
    })
    .catch((err) => {
      node.status({ fill: 'red', shape: 'dot', text: 'open failed' });
      node.error('Open failed: ' + err);
    });
};
