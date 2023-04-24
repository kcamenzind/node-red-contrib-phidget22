import * as phidget22 from 'phidget22-net';
import * as nodeRED from 'node-red';

import {
  getInvokePhidgetMethod,
  openPhidgetDevice,
  PhidgetNodeConfig,
  setupPhidgetDevice,
} from './common';

type LCDNodExtraConfig = {
  screenSize: number;
};
type LCDNodeConfig = nodeRED.NodeDef & PhidgetNodeConfig & LCDNodExtraConfig;

module.exports = function (RED: nodeRED.NodeAPI) {
  function Phidget22LCDNode(this: nodeRED.Node, config: LCDNodeConfig) {
    RED.nodes.createNode(this, config);
    const node = this;
    const state: { didAttach: boolean } = { didAttach: false };
    const lcd = new phidget22.LCD();
    const invokeMethod = getInvokePhidgetMethod(node, config.debug);

    lcd.onAttach = () => {
      invokeMethod(() => lcd.setScreenSize(config.screenSize), 'setScreenSize (in onAttach)');
      const msg = { topic: 'Attach', payload: {} };
      state.didAttach = true;
      node.status({ fill: 'green', shape: 'dot', text: 'attached' });
      node.send(msg);
    };

    setupPhidgetDevice(lcd, node, config);
    openPhidgetDevice(lcd, 'LCD', node, state, config);

    node.on('input', async (msg: any) => {
      switch (msg.topic) {
        case 'getBacklight': {
          const Backlight = await invokeMethod(() => lcd.getBacklight(), 'getBacklight');
          msg.payload = { Backlight };
          node.send(msg);
          break;
        }
        case 'setBacklight': {
          invokeMethod(() => lcd.setBacklight(msg.payload?.backlight), 'setBacklight');
          break;
        }
        case 'getMinBacklight': {
          const MinBacklight = await invokeMethod(() => lcd.getMinBacklight(), 'getMinBacklight');
          msg.payload = { MinBacklight };
          node.send(msg);
          break;
        }
        case 'getMaxBacklight': {
          const MaxBacklight = await invokeMethod(() => lcd.getMaxBacklight(), 'getMaxBacklight');
          msg.payload = { MaxBacklight };
          node.send(msg);
          break;
        }
        case 'setCharacterBitmap': {
          invokeMethod(
            () =>
              lcd.setCharacterBitmap(
                msg.payload?.font,
                msg.payload?.character,
                msg.payload?.bitmap,
              ),
            'setCharacterBitmap',
          );
          break;
        }
        case 'getMaxCharacters': {
          const MaxCharacters = await invokeMethod(
            () => lcd.getMaxCharacters(msg.payload?.font),
            'getMaxCharacters',
          );
          msg.payload = { MaxCharacters };
          node.send(msg);
          break;
        }
        case 'clear': {
          invokeMethod(() => lcd.clear(), 'clear');
          break;
        }
        case 'getContrast': {
          const Contrast = await invokeMethod(() => lcd.getContrast(), 'getContrast');
          msg.payload = { Contrast };
          node.send(msg);
          break;
        }
        case 'setContrast': {
          invokeMethod(() => lcd.setContrast(msg.payload?.contrast), 'setContrast');
          break;
        }
        case 'getMinContrast': {
          const MinContrast = await invokeMethod(() => lcd.getMinContrast(), 'getMinContrast');
          msg.payload = { MinContrast };
          node.send(msg);
          break;
        }
        case 'getMaxContrast': {
          const MaxContrast = await invokeMethod(() => lcd.getMaxContrast(), 'getMaxContrast');
          msg.payload = { MaxContrast };
          node.send(msg);
          break;
        }
        case 'copy': {
          invokeMethod(
            () =>
              lcd.copy(
                msg.payload?.sourceFramebuffer,
                msg.payload?.destFramebuffer,
                msg.payload?.sourceX1,
                msg.payload?.sourceY1,
                msg.payload?.sourceX2,
                msg.payload?.sourceY2,
                msg.payload?.destX,
                msg.payload?.destY,
                msg.payload?.inverted,
              ),
            'copy',
          );
          break;
        }
        case 'getCursorBlink': {
          const CursorBlink = await invokeMethod(() => lcd.getCursorBlink(), 'getCursorBlink');
          msg.payload = { CursorBlink };
          node.send(msg);
          break;
        }
        case 'setCursorBlink': {
          invokeMethod(() => lcd.setCursorBlink(msg.payload?.cursorBlink), 'setCursorBlink');
          break;
        }
        case 'getCursorOn': {
          const CursorOn = await invokeMethod(() => lcd.getCursorOn(), 'getCursorOn');
          msg.payload = { CursorOn };
          node.send(msg);
          break;
        }
        case 'setCursorOn': {
          invokeMethod(() => lcd.setCursorOn(msg.payload?.cursorOn), 'setCursorOn');
          break;
        }
        case 'drawLine': {
          invokeMethod(
            () => lcd.drawLine(msg.payload?.x1, msg.payload?.y1, msg.payload?.x2, msg.payload?.y2),
            'drawLine',
          );
          break;
        }
        case 'drawPixel': {
          invokeMethod(
            () => lcd.drawPixel(msg.payload?.x, msg.payload?.y, msg.payload?.pixelState),
            'drawPixel',
          );
          break;
        }
        case 'drawRect': {
          invokeMethod(
            () =>
              lcd.drawRect(
                msg.payload?.x1,
                msg.payload?.y1,
                msg.payload?.x2,
                msg.payload?.y2,
                msg.payload?.filled,
                msg.payload?.inverted,
              ),
            'drawRect',
          );
          break;
        }
        case 'flush': {
          invokeMethod(() => lcd.flush(), 'flush');
          break;
        }
        case 'getFontSize': {
          const FontSize = await invokeMethod(
            () => lcd.getFontSize(msg.payload?.font),
            'getFontSize',
          );
          msg.payload = { FontSize };
          node.send(msg);
          break;
        }
        case 'setFontSize': {
          invokeMethod(
            () => lcd.setFontSize(msg.payload?.font, msg.payload?.width, msg.payload?.height),
            'setFontSize',
          );
          break;
        }
        case 'getFrameBuffer': {
          const FrameBuffer = await invokeMethod(() => lcd.getFrameBuffer(), 'getFrameBuffer');
          msg.payload = { FrameBuffer };
          node.send(msg);
          break;
        }
        case 'setFrameBuffer': {
          invokeMethod(() => lcd.setFrameBuffer(msg.payload?.frameBuffer), 'setFrameBuffer');
          break;
        }
        case 'getHeight': {
          const Height = await invokeMethod(() => lcd.getHeight(), 'getHeight');
          msg.payload = { Height };
          node.send(msg);
          break;
        }
        case 'initialize': {
          invokeMethod(() => lcd.initialize(), 'initialize');
          break;
        }
        case 'saveFrameBuffer': {
          invokeMethod(() => lcd.saveFrameBuffer(msg.payload?.frameBuffer), 'saveFrameBuffer');
          break;
        }
        case 'getScreenSize': {
          const ScreenSize = await invokeMethod(() => lcd.getScreenSize(), 'getScreenSize');
          msg.payload = { ScreenSize };
          node.send(msg);
          break;
        }
        case 'setScreenSize': {
          invokeMethod(() => lcd.setScreenSize(msg.payload?.screenSize), 'setScreenSize');
          break;
        }
        case 'getSleeping': {
          const Sleeping = await invokeMethod(() => lcd.getSleeping(), 'getSleeping');
          msg.payload = { Sleeping };
          node.send(msg);
          break;
        }
        case 'setSleeping': {
          invokeMethod(() => lcd.setSleeping(msg.payload?.sleeping), 'setSleeping');
          break;
        }
        case 'getWidth': {
          const Width = await invokeMethod(() => lcd.getWidth(), 'getWidth');
          msg.payload = { Width };
          node.send(msg);
          break;
        }
        case 'writeBitmap': {
          invokeMethod(
            () =>
              lcd.writeBitmap(
                msg.payload?.xPosition,
                msg.payload?.yPosition,
                msg.payload?.xSize,
                msg.payload?.ySize,
                msg.payload?.bitmap,
              ),
            'writeBitmap',
          );
          break;
        }
        case 'writeText': {
          invokeMethod(
            () =>
              lcd.writeText(
                msg.payload?.font,
                msg.payload?.xPosition,
                msg.payload?.yPosition,
                msg.payload?.text,
              ),
            'writeText',
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
  RED.nodes.registerType('phidget22-lcd', Phidget22LCDNode);
};
