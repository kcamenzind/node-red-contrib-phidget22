var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22CapacitiveTouchNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var capacitiveTouch = new phidget22.CapacitiveTouch();

        capacitiveTouch.setChannel(config.channel);
        capacitiveTouch.setDeviceSerialNumber(config.deviceSerialNumber);

        capacitiveTouch.onAttach = function() {

            var msg = {topic: "Attach", payload: {}};

            capacitiveTouch.setDataInterval(config.dataInterval).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setDataInterval (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setDataInterval (in onAttach) not supported");
                }
            });

            capacitiveTouch.setTouchValueChangeTrigger(config.touchValueChangeTrigger).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setTouchValueChangeTrigger (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setTouchValueChangeTrigger (in onAttach) not supported");
                }
            });
            
            node.send(msg);
        };

        capacitiveTouch.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        capacitiveTouch.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        capacitiveTouch.onTouch = function(touchValue) {
            var msg = {topic: "Touch", payload: {touchValue: touchValue}};
            node.send(msg);
        };

        capacitiveTouch.onTouchEnd = function() {
            var msg = {topic: "TouchEnd", payload:{}};
            node.send(msg);
        };

        capacitiveTouch.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setDataInterval":
                    capacitiveTouch.setDataInterval(msg.payload.dataInterval).then(function() {
                        if(config.debug) node.warn("setDataInterval success");
                    }).catch(function (err) {
                        node.error("setDataInterval failed:" + err);
                    });
                    break;

                case "setSensitivity":
                    capacitiveTouch.setSensitivity(msg.payload.sensitivity).then(function() {
                        if(config.debug) node.warn("setSensitivity success");
                    }).catch(function (err) {
                        node.error("setSensitivity failed:" + err);
                    });
                    break;

                case "setTouchValueChangeTrigger":
                    capacitiveTouch.setTouchValueChangeTrigger(msg.payload.touchValueChangeTrigger).then(function() {
                        if(config.debug) node.warn("setTouchValueChangeTrigger success");
                    }).catch(function (err) {
                        node.error("setTouchValueChangeTrigger failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            capacitiveTouch.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open CapacitiveTouch (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        capacitiveTouch.open(5000).then(function(){
            if(config.debug) node.warn("CapacitiveTouch Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-capacitivetouch",Phidget22CapacitiveTouchNode);
}