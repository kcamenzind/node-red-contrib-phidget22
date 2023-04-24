var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22DistanceSensorNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var distanceSensor = new phidget22.DistanceSensor();

        distanceSensor.setChannel(config.channel);
        distanceSensor.setDeviceSerialNumber(config.deviceSerialNumber);
        distanceSensor.setHubPort(config.hubPort);

        distanceSensor.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
            distanceSensor.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            distanceSensor.setDistanceChangeTrigger(config.distanceChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDistanceChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDistanceChangeTrigger (in onAttach) not supported");
                }
            });

            distanceSensor.setSonarQuietMode(config.sonarQuietMode).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setSonarQuietMode (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setSonarQuietMode (in onAttach) not supported");
                }
            });

            node.send(msg);
        };

        distanceSensor.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        distanceSensor.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, desc: description}};
            node.send(msg);
        };

        distanceSensor.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        distanceSensor.onDistanceChange = function(distance) {
            var msg = {topic: "DistanceChange", payload: {distance: distance}};
            node.send(msg);
        };

        distanceSensor.onSonarReflectionsUpdate = function(distances, amplitudes, count) {
            var msg = {topic: "SonarReflectionsUpdate", payload: {distances: distances, amplitudes: amplitudes, count: count}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            switch(msg.topic) {

                case "setDataInteval":
                        distanceSensor.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setDistanceChangeTrigger":
                        distanceSensor.setDistanceChangeTrigger(msg.payload.distanceChangeTrigger).then(function() {
                        if(config.debug) node.warn("setDistanceChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setDistanceChangeTrigger failed:" + err);
                    });
                    break;

                case "setSonarQuietMode":
                        distanceSensor.setSonarQuietMode(msg.payload.sonarQuietMode).then(function() {
                        if(config.debug) node.warn("setSonarQuietMode success");
                    }).catch(function (err) {
                        node.error("setSonarQuietMode failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            distanceSensor.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open DistanceSensor (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        distanceSensor.open(5000).then(function(){
            if(config.debug) node.warn("DistanceSensor Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-distancesensor",Phidget22DistanceSensorNode);
}