var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22RFIDNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var rfid = new phidget22.RFID();

        rfid.setChannel(config.channel);
        rfid.setDeviceSerialNumber(config.deviceSerialNumber);
        rfid.setHubPort(config.hubPort);

        rfid.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
            node.send(msg);
        };

        rfid.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        rfid.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        rfid.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        rfid.onTag = function(tag, protocol) {
            var msg = {topic: "Tag", payload: {tag:tag, protocol:protocol}};
            node.send(msg);
        };

        rfid.onTagLost = function(tag, protocol) {
            var msg = {topic: "TagLost", payload: {tag:tag, protocol:protocol}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            switch(msg.topic) {

                case "setAntennaEnabled":
                        rfid.setAntennaEnabled(msg.payload.antennaEnabled).then(function() {
                        if(config.debug) node.warn("setAntennaEnabled success");
                    }).catch(function (err) {
                        node.error("setAntennaEnabled failed:" + err);
                    });
                    break;

                case "write":
                        rfid.write(msg.payload.tagString, msg.payload.protocol, msg.payload.lockTag).then(function() {
                            if(config.debug) node.warn("write success");
                        }).catch(function (err) {
                            node.error("write failed:" + err);
                        });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }
        });

        this.on('close', function() {
            rfid.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open RFID (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        rfid.open(5000).then(function(){
            if(config.debug) node.warn("RFID Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        
    }
    RED.nodes.registerType("phidget22-rfid",Phidget22RFIDNode);
}