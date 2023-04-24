var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22GyroscopeNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var gyroscope = new phidget22.Gyroscope();

        gyroscope.setChannel(config.channel);
        gyroscope.setDeviceSerialNumber(config.deviceSerialNumber);
        gyroscope.setHubPort(config.hubPort);

        gyroscope.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
            
            gyroscope.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });
 
            node.send(msg);
        };

        gyroscope.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        gyroscope.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, desc: description}};
            node.send(msg);
        };

        gyroscope.onAngularRateUpdate = function(angularRate, timestamp) {
            var msg = {topic: "AngularRateUpdate", payload: {angularRate: angularRate, timestamp: timestamp}};
            node.send(msg);
        };

        gyroscope.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "setDataInterval":
                    gyroscope.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "zero":
                    gyroscope.zero().then(function() {
                        if(config.debug) node.warn("zero success");
                    }).catch(function (err) {
                        node.error("zero failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            gyroscope.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open Gyroscope (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        gyroscope.open(5000).then(function(){
            if(config.debug) node.warn("Gyroscope Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });     
    }
    RED.nodes.registerType("phidget22-gyroscope",Phidget22GyroscopeNode);
}