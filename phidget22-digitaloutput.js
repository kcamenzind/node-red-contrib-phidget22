var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22DigitalOutputNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var digitalOutput = new phidget22.DigitalOutput();

        digitalOutput.setChannel(config.channel);
        digitalOutput.setDeviceSerialNumber(config.deviceSerialNumber);
        digitalOutput.setIsHubPortDevice(config.isHubPortDevice);
        digitalOutput.setHubPort(config.hubPort);

        digitalOutput.onAttach = function() {

            digitalOutput.setLEDForwardVoltage(config.LEDForwardVoltage).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setLEDForwardVoltage (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setLEDForwardVoltage (in onAttach) not supported");
                }
            });

            digitalOutput.setLEDCurrentLimit(config.LEDCurrentLimit).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setLEDCurrentLimit (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setLEDCurrentLimit (in onAttach) not supported");
                }
            });

            var msg = {topic: "Attach", payload: {}};
            node.send(msg);
        };

        digitalOutput.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        digitalOutput.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        digitalOutput.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setDutyCycle":
                    digitalOutput.setDutyCycle(msg.payload.dutyCycle).then(function() {
                        if(config.debug) node.warn("setDutyCycle success");
                    }).catch(function (err) {
                        node.error("setDutyCycle failed:" + err);
                    });
                    break;

                case "enableFailsafe":
                    digitalOutput.enableFailsafe(msg.payload.failsafeTime).then(function() {
                        if(config.debug) node.warn("enableFailsafe success");
                    }).catch(function (err) {
                        node.error("enableFailsafe failed:" + err);
                    });
                    break;
                    
                case "setLEDCurrentLimit":
                    digitalOutput.setLEDCurrentLimit(msg.payload.LEDCurrentLimit).then(function() {
                        if(config.debug) node.warn("setLEDCurrentLimit success");
                    }).catch(function (err) {
                        node.error("setLEDCurrentLimit failed:" + err);
                    });
                    break;

                case "setLEDForwardVoltage":
                    digitalOutput.setLEDForwardVoltage(msg.payload.LEDForwardVoltage).then(function() {
                        if(config.debug) node.warn("setLEDForwardVoltage success");
                    }).catch(function (err) {
                        node.error("setLEDForwardVoltage failed:" + err);
                    });
                    break;

                case "resetFailsafe":
                    digitalOutput.resetFailsafe().then(function() {
                        if(config.debug) node.warn("resetFailsafe success");
                    }).catch(function (err) {
                        node.error("resetFailsafe failed:" + err);
                    });
                    break;

                case "setState":
                    digitalOutput.setState(msg.payload.state).then(function() {
                        if(config.debug) node.warn("setState success");
                    }).catch(function (err) {
                        node.error("setState failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            digitalOutput.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open DigitalOutput (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        digitalOutput.open(5000).then(function(){
            if(config.debug) node.warn("DigitalOutput Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-digitaloutput",Phidget22DigitalOutputNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}