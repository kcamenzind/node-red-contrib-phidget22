var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22LCDNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var lcd = new phidget22.LCD();

        lcd.setChannel(config.channel);
        lcd.setDeviceSerialNumber(config.deviceSerialNumber);
        lcd.setHubPort(config.hubPort);

        lcd.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            lcd.setScreenSize(config.screenSize).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setScreenSize (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setScreenSize (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        lcd.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        lcd.onError = function(code, desc) {
            var msg = {topic: "Error", payload: {code: code, desc: desc}};
            node.send(msg);
        };

        lcd.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "getBacklight":
                    var msg = {topic:"getBacklight", _msgid: msg._msgid, payload: {Backlight: lcd.getBacklight()}};
                    node.send(msg);
                    break;

                case "setBacklight":
                        lcd.setBacklight(msg.payload.backlight).then(function() {
                        if(config.debug) node.warn("setBacklight success");
                    }).catch(function (err) {
                        node.error("setBacklight failed:" + err);
                    });
                    break;

                case "getMinBacklight":
                    var msg = {topic:"getMinBacklight", _msgid: msg._msgid, payload: {MinBacklight: lcd.getMinBacklight()}};
                    node.send(msg);
                    break;

                case "getMaxBacklight":
                    var msg = {topic:"getMaxBacklight", _msgid: msg._msgid, payload: {MaxBacklight: lcd.getMaxBacklight()}};
                    node.send(msg);
                    break;

                case "setCharacterBitmap":
                        lcd.setCharacterBitmap(msg.payload.font, msg.payload.character, msg.payload.bitmap).then(function() {
                            if(config.debug) node.warn("setCharacterBitmap success");
                        }).catch(function (err) {
                            node.error("setCharacterBitmap failed:" + err);
                        });
                    break;

                case "getMaxCharacters":
                    var msg = {topic:"getMaxCharacters", _msgid: msg._msgid, payload: {MaxCharacters: lcd.getMaxCharacters(msg.payload.font)}};
                    node.send(msg);
                    break;

                case "clear":
                        lcd.clear().then(function() {
                            if(config.debug) node.warn("clear success");
                        }).catch(function (err) {
                            node.error("clear failed:" + err);
                        });
                    break;

                case "getContrast":
                    var msg = {topic:"getContrast", _msgid: msg._msgid, payload: {Contrast: lcd.getContrast()}};
                    node.send(msg);
                    break;

                case "setContrast":
                        lcd.setContrast(msg.payload.contrast).then(function() {
                            if(config.debug) node.warn("setContrast success");
                        }).catch(function (err) {
                            node.error("setContrast failed:" + err);
                        });
                    break;

                case "getMinContrast":
                    var msg = {topic:"getMinContrast", _msgid: msg._msgid, payload: {MinContrast: lcd.getMinContrast()}};
                    node.send(msg);
                    break;

                case "getMaxContrast":
                    var msg = {topic:"getMaxContrast", _msgid: msg._msgid, payload: {MaxContrast: lcd.getMaxContrast()}};
                    node.send(msg);
                    break;

                case "copy":
                        lcd.copy(msg.payload.sourceFramebuffer, msg.payload.destFramebuffer, msg.payload.sourceX1, msg.payload.sourceY1, msg.payload.sourceX2, msg.payload.sourceY2, msg.payload.destX, msg.payload.destY, msg.payload.inverted).then(function() {
                            if(config.debug) node.warn("copy success");
                        }).catch(function (err) {
                            node.error("copy failed:" + err);
                        });
                    break;

                case "getCursorBlink":
                    var msg = {topic:"getCursorBlink", _msgid: msg._msgid, payload: {CursorBlink: lcd.getCursorBlink()}};
                    node.send(msg);
                    break;

                case "setCursorBlink":
                        lcd.setCursorBlink(msg.payload.cursorBlink).then(function() {
                            if(config.debug) node.warn("setCursorBlink success");
                        }).catch(function (err) {
                            node.error("setCursorBlink failed:" + err);
                        });
                    break;

                case "getCursorOn":
                    var msg = {topic:"getCursorOn", _msgid: msg._msgid, payload: {CursorOn: lcd.getCursorOn()}};
                    node.send(msg);
                    break;

                case "setCursorOn":
                        lcd.setCursorOn(msg.payload.cursorOn).then(function() {
                            if(config.debug) node.warn("setCursorOn success");
                        }).catch(function (err) {
                            node.error("setCursorOn failed:" + err);
                        });
                    break;

                case "drawLine":
                        lcd.drawLine(msg.payload.x1, msg.payload.y1, msg.payload.x2, msg.payload.y2).then(function() {
                            if(config.debug) node.warn("drawLine success");
                        }).catch(function (err) {
                            node.error("drawLine failed:" + err);
                        });
                    break;

                case "drawPixel":
                        lcd.drawPixel(msg.payload.x, msg.payload.y, msg.payload.pixelState).then(function() {
                            if(config.debug) node.warn("drawPixel success");
                        }).catch(function (err) {
                            node.error("drawPixel failed:" + err);
                        });
                    break; 

                case "drawRect":
                        lcd.drawRect(msg.payload.x1, msg.payload.y1, msg.payload.x2, msg.payload.y2, msg.payload.filled, msg.payload.inverted).then(function() {
                            if(config.debug) node.warn("drawRect success");
                        }).catch(function (err) {
                            node.error("drawRect failed:" + err);
                        });
                    break;

                case "flush":
                        lcd.flush().then(function() {
                            if(config.debug) node.warn("flush success");
                        }).catch(function (err) {
                            node.error("flush failed:" + err);
                        });
                    break;

                case "getFontSize":
                    var msg = {topic:"getFontSize", _msgid: msg._msgid, payload: {FontSize: lcd.getFontSize(msg.payload.font)}};
                    node.send(msg);
                    break;

                case "setFontSize":
                        lcd.setFontSize(msg.payload.font, msg.payload.width, msg.payload.height).then(function() {
                            if(config.debug) node.warn("setFontSize success");
                        }).catch(function (err) {
                            node.error("setFontSize failed:" + err);
                        });
                    break;

                case "getFrameBuffer":
                    var msg = {topic:"getFrameBuffer", _msgid: msg._msgid, payload: {FrameBuffer: lcd.getFrameBuffer()}};
                    node.send(msg);
                    break;

                case "setFrameBuffer":
                        lcd.setFrameBuffer(msg.payload.frameBuffer).then(function() {
                            if(config.debug) node.warn("setFrameBuffer success");
                        }).catch(function (err) {
                            node.error("setFrameBuffer failed:" + err);
                        });
                    break;

                case "getHeight":
                    var msg = {topic:"getHeight", _msgid: msg._msgid, payload: {Height: lcd.getHeight()}};
                    node.send(msg);
                    break;

                case "initialize":
                        lcd.initialize().then(function() {
                            if(config.debug) node.warn("initialize success");
                        }).catch(function (err) {
                            node.error("initialize failed:" + err);
                        });
                    break;

                case "saveFrameBuffer":
                        lcd.saveFrameBuffer(msg.payload.frameBuffer).then(function() {
                            if(config.debug) node.warn("saveFrameBuffer success");
                        }).catch(function (err) {
                            node.error("saveFrameBuffer failed:" + err);
                        });
                    break;

                case "getScreenSize":
                    var msg = {topic:"getScreenSize", _msgid: msg._msgid, payload: {ScreenSize: lcd.getScreenSize()}};
                    node.send(msg);
                    break;

                case "setScreenSize":
                        lcd.setScreenSize(msg.payload.screenSize).then(function() {
                            if(config.debug) node.warn("setScreenSize success");
                        }).catch(function (err) {
                            node.error("setScreenSize failed:" + err);
                        });
                    break;

                case "getSleeping":
                    var msg = {topic:"getSleeping", _msgid: msg._msgid, payload: {Sleeping: lcd.getSleeping()}};
                    node.send(msg);
                    break;

                case "setSleeping":
                        lcd.setSleeping(msg.payload.sleeping).then(function() {
                            if(config.debug) node.warn("setSleeping success");
                        }).catch(function (err) {
                            node.error("setSleeping failed:" + err);
                        });
                    break;

                case "getWidth":
                    var msg = {topic:"getWidth", _msgid: msg._msgid, payload: {Width: lcd.getWidth()}};
                    node.send(msg);
                    break;

                case "writeBitmap":
                        lcd.writeBitmap(msg.payload.xPosition, msg.payload.yPosition, msg.payload.xSize, msg.payload.ySize, msg.payload.bitmap).then(function() {
                            if(config.debug) node.warn("writeBitmap success");
                        }).catch(function (err) {
                            node.error("writeBitmap failed:" + err);
                        });
                    break;

                case "writeText":
                        lcd.writeText(msg.payload.font, msg.payload.xPosition, msg.payload.yPosition, msg.payload.text).then(function() {
                            if(config.debug) node.warn("writeText success");
                        }).catch(function (err) {
                            node.error("writeText failed:" + err);
                        });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            lcd.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open LCD (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        lcd.open(5000).then(function(){
            if(config.debug) node.warn("LCD Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
    }
    RED.nodes.registerType("phidget22-lcd",Phidget22LCDNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}