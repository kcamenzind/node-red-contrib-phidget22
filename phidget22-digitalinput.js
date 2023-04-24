var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22DigitalInputNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var digitalInput = new phidget22.DigitalInput();

        digitalInput.setChannel(config.channel);
        digitalInput.setDeviceSerialNumber(config.deviceSerialNumber);
        digitalInput.setIsHubPortDevice(config.isHubPortDevice);
        digitalInput.setHubPort(config.hubPort);

        digitalInput.onAttach = function() {

            digitalInput.setPowerSupply(config.powerSupply).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setPowerSupply (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setPowerSupply (in onAttach) not supported");
                }
            });

            digitalInput.setInputMode(config.inputMode).catch(function (err) {
                if(err.errorCode != 20) {
                    // Ignore error code 20: unsupported errors expected for some devices
                    node.error("setInputMode (in onAttach) failed:" + err);
                }
                else {
                    if(config.debug) node.warn("setInputMode (in onAttach) not supported");
                }
            });

            var msg = {topic: "Attach", payload: {}};
            node.send(msg);

            // Send initial stateChange event so the user knows the starting state
            msg = {topic: "StateChange", payload: {state: digitalInput.getState()}}; 
            node.send(msg);
        };

        digitalInput.onDetach = function() {
            var msg = {topic: "Detach", payload: {}};
            node.send(msg);
        };

        digitalInput.onError = function(code, description) {
            var msg = {topic: "Error", payload: {code: code, description: description}};
            node.send(msg);
        };

        digitalInput.onPropertyChange = function(propertyName) {
            var msg = {topic: "PropertyChange", payload: {propertyName: propertyName}};
            node.send(msg);
        };

        digitalInput.onStateChange = function(state) {
            var msg = {topic: "StateChange", payload: {state: state}};
            node.send(msg);
        };

        this.on('input', function(msg) {
            
            switch(msg.topic) {
                case "setInputMode":
                    digitalInput.setInputMode(msg.payload.inputMode).then(function() {
                        if(config.debug) node.warn("setInputMode success");
                    }).catch(function (err) {
                        node.error("setInputMode failed:" + err);
                    });
                    break;

                case "setPowerSupply":
                    digitalInput.setPowerSupply(msg.payload.powerSupply).then(function() {
                        if(config.debug) node.warn("setPowerSupply success");
                    }).catch(function (err) {
                        node.error("setPowerSupply failed:" + err);
                    });
                    break;

                default:
                    node.error("Unsupported message topic: " + msg.topic);
                    break;
            }

        });

        this.on('close', function() {
            digitalInput.close().catch(function(err) {
                if(err.errorCode != 28) {
                    // Ignore error code 28: occurs when the connection closes before this node
                    node.error("close failed:" + err);
                }
            });
        });

        if(config.debug) node.warn("Attempting to Open DigitalInput (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        
        digitalInput.open(5000).then(function(){
            if(config.debug) node.warn("DigitalInput Opened (SN:" + config.deviceSerialNumber + ", Ch:" + config.channel +")");
        })
        .catch(function (err) {
            node.error("Open failed:" + err);
        });
        

        
    }
    RED.nodes.registerType("phidget22-digitalinput",Phidget22DigitalInputNode);

    RED.httpAdmin.get('/phidget22/js/*', function(req, res){
        var options = {
            root: __dirname + '/static/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });
}