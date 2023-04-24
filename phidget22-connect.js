var phidget22 = require('phidget22');


module.exports = function(RED) {
    function Phidget22ConnectNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var conn = new phidget22.Connection(parseInt(config.port),config.hostname);

        conn.onAuthenticationNeeded = function() {
            var msg = {topic: "AuthenticationNeeded", payload: {}};
            node.send(msg);
        };

        conn.onConnect = function() {
            var msg = {topic: "Connect", payload: {}};
            node.send(msg);
        };

        conn.onDisconnect = function() {
            var msg = {topic: "Disconnect", payload: {}};
            node.send(msg);
        };

        conn.onError = function(code, msg) {
            var msg = {topic: "Error", payload: {code: code, msg: msg}};
            node.send(msg);
        };

        if(config.debug) node.warn("Attempting to Connect to Server (" + config.hostname + ":" + config.port + ")");

        conn.connect().then(function(){
            if(config.debug) node.warn("Connect Success (" + config.hostname + ":" + config.port + ")");
        })
        .catch(function (err) {
            node.error("Connect failed");
        });

        this.on('close', function() {
            conn.close();
            conn.delete();
        });
    }
    RED.nodes.registerType("phidget22-connect",Phidget22ConnectNode);
}