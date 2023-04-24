var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22GPSNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var gps = new phidget22.GPS();

        gps.setChannel(config.channel);
        gps.setDeviceSerialNumber(config.deviceSerialNumber);

        gps.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
            node.send(msg);
        };

        gps.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        gps.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        gps.onHeadingChange = function(heading, velocity) {
            var msg = {topic: "HeadingChange", payload: {heading:heading, velocity:velocity}};
            node.send(msg);
        };

        gps.onPositionChange = function(latitude, longitude, altitude) {
            var msg = {topic: "PositionChange", payload: {latitude:latitude, longitude:longitude, altitude:altitude}};
            node.send(msg);
        };

        gps.onPositionFixStateChange = function(positionFixState) {
            var msg = {topic: "PositionFixStateChange", payload: {positionFixState: positionFixState}};
            node.send(msg);
        };

        gps.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('close', function() {
            gps.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open GPS (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        gps.open(5000).then(function(){
            if(config.debug) node.warn("GPS Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-gps",Phidget22GPSNode);
}