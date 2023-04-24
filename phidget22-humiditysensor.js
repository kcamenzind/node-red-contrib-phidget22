var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22HumiditySensorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var humiditySensor = new phidget22.HumiditySensor();

        humiditySensor.setChannel(config.channel);
        humiditySensor.setDeviceSerialNumber(config.deviceSerialNumber);

        humiditySensor.onAttach = function() {

            var msg = {topic: "Attach", payload: {}};

            humiditySensor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            humiditySensor.setHumidityChangeTrigger(config.humidityChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setHumidityChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setHumidityChangeTrigger (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        humiditySensor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        humiditySensor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        humiditySensor.onHumidityChange = function(humidity) {
            var msg = {topic: "HumidityChange", payload: {humidity: humidity}};
            node.send(msg);
        };

        humiditySensor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "setDataInterval":
                        humiditySensor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setHumidityChangeTrigger":
                        humiditySensor.setHumidityChangeTrigger(msg.payload.humidityChangeTrigger).then(function() {
                        if(config.debug) node.warn("setHumidityChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setHumidityChangeTrigger failed:" + err);
                    });
                    break;
  
                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            humiditySensor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open HumiditySensor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        humiditySensor.open(5000).then(function(){
            if(config.debug) node.warn("HumiditySensor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-humiditysensor",Phidget22HumiditySensorNode);
}