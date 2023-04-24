var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22IRNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var ir = new phidget22.IR();

        ir.setChannel(config.channel);
        ir.setDeviceSerialNumber(config.deviceSerialNumber);
        ir.setHubPort(config.hubPort);

        ir.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
            node.send(msg);
        };

        ir.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        ir.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        ir.onCode = function(code, bitCount, isRepeat) {
            var msg = {topic: "Code", payload: {code:code, bitCount:bitCount, isRepeat:isRepeat}};
            node.send(msg);
        };

        ir.onLearn = function(code, codeInfo) {
            var msg = {topic: "Learn", payload: {code:code, codeInfo:codeInfo}};
            node.send(msg);
        };

        ir.onRawData = function(data) {
            var msg = {topic: "RawData", payload: {data: data}};
            node.send(msg);
        };

        ir.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('close', function() {
            ir.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                
                case "transmit":
                        ir.transmit(msg.payload.code, msg.payload.codeInfo).then(function() {
                        if(config.debug) node.warn("transmit success");
                    }).catch(function (err) {
                        node.error("transmit failed:" + err);
                    });
                    break;

                case "transmitRaw":
                        ir.transmitRaw(msg.payload.data, msg.payload.carrierFrequency, msg.payload.dutyCycle, msg.payload.gap).then(function() {
                            if(config.debug) node.warn("transmitRaw success");
                        }).catch(function (err) {
                            node.error("transmitRaw failed:" + err);
                        });
                    break;

                case "transmitRepeat":
                        ir.transmitRepeat().then(function() {
                            if(config.debug) node.warn("transmitRepeat success");
                        }).catch(function (err) {
                            node.error("transmitRepeat failed:" + err);
                        });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        if(config.debug) node.warn("Attempting to Open IR (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        ir.open(5000).then(function(){
            if(config.debug) node.warn("IR Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });          
    }
    RED.nodes.registerType("phidget22-ir",Phidget22IRNode);
}