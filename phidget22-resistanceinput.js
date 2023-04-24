var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22ResistanceInputNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var resistanceInput = new phidget22.ResistanceInput();

        resistanceInput.setChannel(config.channel);
        resistanceInput.setDeviceSerialNumber(config.deviceSerialNumber);
        resistanceInput.setHubPort(config.hubPort);

        resistanceInput.onAttach = function() {
            
            var msg = {topic: "Attach", payload: {}};
  
            resistanceInput.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            resistanceInput.setResistanceChangeTrigger(config.resistanceChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setResistanceChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setResistanceChangeTrigger (in onAttach) not supported");
                }
            });

            resistanceInput.setRTDWireSetup(config.RTDWireSetup).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setRTDWireSetup (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setRTDWireSetup (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        resistanceInput.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        resistanceInput.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        resistanceInput.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        resistanceInput.onResistanceChange = function(resistance) {
            var msg = {topic: "ResistanceChange", payload: {resistance: resistance}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            switch(msg.topic) {

                case "setDataInterval":
                        resistanceInput.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setResistanceChangeTrigger":
                        resistanceInput.setResistanceChangeTrigger(msg.payload.resistanceChangeTrigger).then(function() {
                        if(config.debug) node.warn("setResistanceChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setResistanceChangeTrigger failed:" + err);
                    });
                    break;

                case "setRTDWireSetup":
                        resistanceInput.setRTDWireSetup(msg.payload.RTDWireSetup).then(function() {
                        if(config.debug) node.warn("setRTDWireSetup success");
                    }).catch(function (err) {
                        node.error("setRTDWireSetup failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            resistanceInput.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open ResistanceInput (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        resistanceInput.open(5000).then(function(){
            if(config.debug) node.warn("ResistanceInput Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        
    }
    RED.nodes.registerType("phidget22-resistanceinput",Phidget22ResistanceInputNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}