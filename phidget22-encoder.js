var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22EncoderNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var encoder = new phidget22.Encoder();

        encoder.setChannel(config.channel);
        encoder.setDeviceSerialNumber(config.deviceSerialNumber);
        encoder.setHubPort(config.hubPort);

        encoder.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            encoder.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });
            encoder.setPositionChangeTrigger(config.positionChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setPositionChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setPositionChangeTrigger (in onAttach) not supported");
                }
            });

            encoder.setIOMode(config.IOMode).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setIOMode (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setIOMode (in onAttach) not supported");
                }
            });
            node.send(msg);
        };

        encoder.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        encoder.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        encoder.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        encoder.onPositionChange = function(positionChange, timeChange, indexTriggered) {
            var msg = {topic: "PositionChange", payload: {positionChange:positionChange, timeChange:timeChange, indexTriggered:indexTriggered}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            switch(msg.topic) {

                case "setEnabled":
                    encoder.setEnabled(msg.payload.enabled).then(function() {
                        if(config.debug) node.warn("setEnabled success");
                    }).catch(function (err) {
                        node.error("setEnabled failed:" + err);
                    });
                    break;

                case "setDataInterval":
                    encoder.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setIOMode":
                    encoder.setIOMode(msg.payload.IOMode).then(function() {
                        if(config.debug) node.warn("setIOMode success");
                    }).catch(function (err) {
                        node.error("setIOMode failed:" + err);
                    });
                    break;

                case "setPosition":
                    encoder.setPosition(msg.payload.position);
                    break;

                case "setPositionChangeTrigger":
                    encoder.setPositionChangeTrigger(msg.payload.positionChangeTrigger).then(function() {
                        if(config.debug) node.warn("setPositionChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setPositionChangeTrigger failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            encoder.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open Encoder (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        encoder.open(5000).then(function(){
            if(config.debug) node.warn("Encoder Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        
    }
    RED.nodes.registerType("phidget22-encoder",Phidget22EncoderNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}