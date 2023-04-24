var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22HubNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var hub = new phidget22.Hub();

        hub.setDeviceSerialNumber(config.deviceSerialNumber);

        hub.onAttach = function() {
            var msg = {topic: "Attach", payload: {}};
            node.send(msg);
        };

        hub.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        hub.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        hub.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {

                case "setPortPower":
                    hub.setPortPower(msg.payload.port, msg.payload.state).then(function() {
                        if(config.debug) node.warn("setPortPower success");
                    }).catch(function (err) {
                        node.error("setPortPower failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            hub.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open Hub (SN:" + config.deviceSerialNumber + ")");
        
        hub.open(5000).then(function(){
            if(config.debug) node.warn("Hub Opened (SN:" + config.deviceSerialNumber +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-hub",Phidget22HubNode);
}