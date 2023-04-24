var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22TemperatureSensorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var temperatureSensor = new phidget22.TemperatureSensor();

        temperatureSensor.setChannel(config.channel);
        temperatureSensor.setDeviceSerialNumber(config.deviceSerialNumber);
        temperatureSensor.setHubPort(config.hubPort);

        temperatureSensor.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};

            temperatureSensor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });
            temperatureSensor.setTemperatureChangeTrigger(config.temperatureChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setTemperatureChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setTemperatureChangeTrigger (in onAttach) not supported");
                }
            });

            temperatureSensor.setRTDType(config.RTDType).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setRTDType (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setRTDType (in onAttach) not supported");
                }
            });

            temperatureSensor.setRTDWireSetup(config.RTDWireSetup).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setRTDWireSetup (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setRTDWireSetup (in onAttach) not supported");
                }
            });
            temperatureSensor.setThermocoupleType(config.thermocoupleType).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setThermocoupleType (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setThermocoupleType (in onAttach) not supported");
                }
            });
            node.send(msg);
        };

        temperatureSensor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        temperatureSensor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        temperatureSensor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        temperatureSensor.onTemperatureChange = function(temperature) {
            var msg = {topic: "TemperatureChange", payload: {temperature: temperature}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "getDataInterval":
                    var msg = {topic:"getDataInterval", _msgid: msg._msgid, payload: {DataInterval: temperatureSensor.getDataInterval()}};
                    node.send(msg);
                    break;
                
                case "setDataInterval":
                    temperatureSensor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "getMinDataInterval":
                    var msg = {topic:"getMinDataInterval", _msgid: msg._msgid, payload: {MinDataInterval: temperatureSensor.getMinDataInterval()}};
                    node.send(msg);
                    break;

                case "getMaxDataInterval":
                    var msg = {topic:"getMaxDataInterval", _msgid: msg._msgid, payload: {MaxDataInterval: temperatureSensor.getMaxDataInterval()}};
                    node.send(msg);
                    break;

                case "getRTDType":
                    var msg = {topic:"getRTDType", _msgid: msg._msgid, payload: {RTDType: temperatureSensor.getRTDType()}};
                    node.send(msg);
                    break;

                case "setRTDType":
                    temperatureSensor.setRTDType(msg.payload.RTDType).then(function() {
                        if(config.debug) node.warn("setRTDType success");
                    }).catch(function (err) {
                        node.error("setRTDType failed:" + err);
                    });
                    break;

                case "getRTDWireSetup":
                    var msg = {topic:"getRTDWireSetup", _msgid: msg._msgid, payload: {RTDWireSetup: temperatureSensor.getRTDWireSetup()}};
                    node.send(msg);
                    break;

                case "setRTDWireSetup":
                    temperatureSensor.setRTDWireSetup(msg.payload.RTDWireSetup).then(function() {
                        if(config.debug) node.warn("setRTDWireSetup success");
                    }).catch(function (err) {
                        node.error("setRTDWireSetup failed:" + err);
                    });
                    break;

                case "getTemperature":
                    var msg = {topic:"getTemperature", _msgid: msg._msgid, payload: {Temperature: temperatureSensor.getTemperature()}};
                    node.send(msg);
                    break;

                case "getMinTemperature":
                    var msg = {topic:"getMinTemperature", _msgid: msg._msgid, payload: {MinTemperature: temperatureSensor.getMinTemperature()}};
                    node.send(msg);
                    break;

                case "getMaxTemperature":
                    var msg = {topic:"getMaxTemperature", _msgid: msg._msgid, payload: {MaxTemperature: temperatureSensor.getMaxTemperature()}};
                    node.send(msg);
                    break;

                case "getTemperatureChangeTrigger":
                    var msg = {topic:"getTemperatureChangeTrigger", _msgid: msg._msgid, payload: {TemperatureChangeTrigger: temperatureSensor.getTemperatureChangeTrigger()}};
                    node.send(msg);
                    break;

                case "setTemperatureChangeTrigger":
                    temperatureSensor.setTemperatureChangeTrigger(msg.payload.temperatureChangeTrigger).then(function() {
                        if(config.debug) node.warn("setTemperatureChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setTemperatureChangeTrigger failed:" + err);
                    });
                    break;

                case "getMinTemperatureChangeTrigger":
                    var msg = {topic:"getMinTemperatureChangeTrigger", _msgid: msg._msgid, payload: {MinTemperatureChangeTrigger: temperatureSensor.getMinTemperatureChangeTrigger()}};
                    node.send(msg);
                    break;

                case "getMaxTemperatureChangeTrigger":
                    var msg = {topic:"getMaxTemperatureChangeTrigger", _msgid: msg._msgid, payload: {MaxTemperatureChangeTrigger: temperatureSensor.getMaxTemperatureChangeTrigger()}};
                    node.send(msg);
                    break;

                case "getThermocoupleType":
                    var msg = {topic:"getThermocoupleType", _msgid: msg._msgid, payload: {ThermocoupleType: temperatureSensor.getThermocoupleType()}};
                    node.send(msg);
                    break;

                case "setThermocoupleType":
                    temperatureSensor.setThermocoupleType(msg.payload.thermocoupleType).then(function() {
                        if(config.debug) node.warn("setThermocoupleType success");
                    }).catch(function (err) {
                        node.error("setThermocoupleType failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            temperatureSensor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open TemperatureSensor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        temperatureSensor.open(5000).then(function(){
            if(config.debug) node.warn("TemperatureSensor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        
    }
    RED.nodes.registerType("phidget22-temperaturesensor",Phidget22TemperatureSensorNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}