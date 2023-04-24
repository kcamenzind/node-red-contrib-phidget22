var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22PowerGuardNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var powerGuard = new phidget22.PowerGuard();

        powerGuard.setChannel(config.channel);
        powerGuard.setDeviceSerialNumber(config.deviceSerialNumber);
        powerGuard.setHubPort(config.hubPort);

        powerGuard.onAttach = function() {
            
            var msg = {topic: "Attach", payload: {}};

            powerGuard.setFanMode(config.fanMode).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setFanMode (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setFanMode (in onAttach) not supported");
                }
            });

            powerGuard.setOverVoltage(config.overVoltage).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setOverVoltage (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setOverVoltage (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        powerGuard.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        powerGuard.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        powerGuard.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            switch(msg.topic) {

                case "enableFailsafe":
                    powerGuard.enableFailsafe(msg.payload.failsafeTime).then(function() {
                            if(config.debug) node.warn("enableFailsafe success");
                        }).catch(function (err) {
                            node.error("enableFailsafe failed:" + err);
                        });
                    break;

                case "setFanMode":
                    powerGuard.setFanMode(msg.payload.fanMode).then(function() {
                            config.fanmode = msg.payload;
                            if(config.debug) node.warn("setFanMode success");
                        }).catch(function (err) {
                            node.error("setFanMode failed:" + err);
                        });
                    break;

                case "setOverVoltage":
                    powerGuard.setOverVoltage(msg.payload.overVoltage).then(function() {
                            if(config.debug) node.warn("setOverVoltage success");
                        }).catch(function (err) {
                            node.error("setOverVoltage failed:" + err);
                        });
                    break;

                case "setPowerEnabled":
                    powerGuard.setPowerEnabled(msg.payload.powerEnabled).then(function() {
                        if(config.debug) node.warn("setPowerEnabled success");
                    }).catch(function (err) {
                        node.error("setPowerEnabled failed:" + err);
                    });
                    break;

                case "resetFailsafe":
                    powerGuard.resetFailsafe().then(function() {
                            if(config.debug) node.warn("resetFailsafe success");
                        }).catch(function (err) {
                            node.error("resetFailsafe failed:" + err);
                        });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            powerGuard.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open PowerGuard (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        powerGuard.open(5000).then(function(){
            if(config.debug) node.warn("PowerGuard Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        
    }
    RED.nodes.registerType("phidget22-powerguard",Phidget22PowerGuardNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}