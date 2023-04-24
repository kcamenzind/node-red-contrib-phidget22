var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22VoltageInputNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var voltageInput = new phidget22.VoltageInput();

        voltageInput.setChannel(config.channel);
        voltageInput.setDeviceSerialNumber(config.deviceSerialNumber);
        voltageInput.setIsHubPortDevice(config.isHubPortDevice);
        voltageInput.setHubPort(config.hubPort);

        voltageInput.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            voltageInput.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            voltageInput.setVoltageChangeTrigger(config.voltageChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setVoltageChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setVoltageChangeTrigger (in onAttach) not supported");
                }
            });

            voltageInput.setSensorType(config.sensorType).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setSensorType (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setSensorType (in onAttach) not supported");
                }
            });

            voltageInput.setPowerSupply(config.powerSupply).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setPowerSupply (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setPowerSupply (in onAttach) not supported");
                }
            });

            voltageInput.setVoltageRange(config.voltageRange).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setVoltageRange (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setVoltageRange (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        voltageInput.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        voltageInput.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        voltageInput.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        voltageInput.onVoltageChange = function(voltage) {
            var msg = {topic: "VoltageChange", payload: {voltage: voltage}};
            node.send(msg);
        };

        voltageInput.onSensorChange = function(sensorValue, sensorUnit) {
            var msg = {topic: "SensorChange", payload: {sensorValue: sensorValue, sensorUnit: sensorUnit}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setDataInterval":
                    voltageInput.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setPowerSupply":
                    voltageInput.setPowerSupply(msg.payload.powerSupply).then(function() {
                        if(config.debug) node.warn("setPowerSupply success");
                    }).catch(function (err) {
                        node.error("setPowerSupply failed:" + err);
                    });
                    break;

                case "setSensorType":
                    voltageInput.setSensorType(msg.payload.sensorType).then(function() {
                        if(config.debug) node.warn("setSensorType success");
                    }).catch(function (err) {
                        node.error("setSensorType failed:" + err);
                    });
                    break;

                case "setSensorValueChangeTrigger":
                    voltageInput.setSensorValueChangeTrigger(msg.payload.sensorValueChangeTrigger).then(function() {
                        if(config.debug) node.warn("setSensorValueChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setSensorValueChangeTrigger failed:" + err);
                    });
                    break;

                case "setVoltageChangeTrigger":
                    voltageInput.setVoltageChangeTrigger(msg.payload.voltageChangeTrigger).then(function() {
                        if(config.debug) node.warn("setVoltageChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setVoltageChangeTrigger failed:" + err);
                    });
                    break;

                case "setVoltageRange":
                    voltageInput.setVoltageRange(msg.payload.voltageRange).then(function() {
                        if(config.debug) node.warn("setVoltageRange success");
                    }).catch(function (err) {
                        node.error("setVoltageRange failed:" + err);
                    });
                    break;
 
                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            voltageInput.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open VoltageInput (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        voltageInput.open(5000).then(function(){
            if(config.debug) node.warn("VoltageInput Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-voltageinput",Phidget22VoltageInputNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}