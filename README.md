## Synopsis

This module will provide Node-RED access to Phidgets devices and controllers. Since this module uses the Phidget22 JavaScript libraries, you should use the [JavaScript API documentation](https://www.phidgets.com/?view=api&lang=JavaScript) to determine the names of methods, events and variables. Node-RED is not currently an officially supported IDE for Phidget22, although this module is managed by Phidgets Inc. employees. If you have any questions, bug reports, or recommendations for this module, please send them to mparadis@phidgets.com. 

## Start Network Server and Connect

The JavaScript version of the Phidget22 libraries only runs over the network, so you'll need to start an instance of the Phidget Network Server either on the same computer you're using Node-RED on, or another computer in the same network. In Windows and macOS, you can start the Network Server through the Phidget Control Panel, and in Linux it can be started through the command line. You can find full instructions on the [Network Server Documentation](https://www.phidgets.com/docs/Phidget_Network_Server) page. 

Once your Phidget Network Server is up and running, you can open your Node-RED flow and use the **connect** node and specify a serial number or hostname. 

## Node Configuration

You can double-click on a Phidget node to set some of the basic properties such as channel and serial number. You'll also be able to initialize many device-specific properties. If you initialize a property here, but later change it using a method during your flow, it won't change the initial configuration. This means the next time the flow starts, it will still set the property to what you've entered in this configuration pane.

The node has no way of knowing what specific Phidget device you'll try to open, so there may be properties in this panel that don't apply to your device. For example, when using the **TemperatureSensor** node with a TMP1000, the **Thermocouple Type** property won't do anything. You can see a complete list of functions, events, and enums supported by your device on the forementioned API page and selecting the device from the drop down menu.

You can also enable a debug mode here, which will print "warn" messages to the console when functions are successfully called.

## Methods

In order to use a method from the API, you must pass a message into the node with a topic identical to the method name and a payload consisting of a JSON object that contains all parameters with naming that matches the API. For example, to use **setThermocoupleType(thermocoupleType)**, you need to construct a message like so:

    Topic: setThermocoupleType
    Payload: {
        "thermocoupleType": 2
    }

If theres a typo in the topic name, you'll get an "Unsupported Message Topic" error. If there's a typo in one of the variable names, you'll get a "missing value" error. You can click on the node ID in the debug window to highlight which node recieved the bad message. 

Currently, none of the "get" methods have been implemented in this module because for the majority of projects, it is not necessary to poll for properties since you can either get them from events, or you can have your program keep track of the ones you've set yourself. Eventually we plan to add the "get" methods to this module for completeness' sake. 

## Events

Whenever an event triggers, the associated Phidget node will output a message with a topic equal to the event name in the API, and a payload consisting of a JSON object that contains all variables with naming that matches the API. For example, the **AccelerationChange** event for the Accelerometer node would look like this:

    Topic: AccelerationChange
    Payload: {
        "acceleration": {
            "0": 0.0256
            "1": 0.001
            "2": 1.0117
        }
        "timestamp": 62093
    }

All event handlers in this module are automatically and permanently enabled, so you may want to use a **switch** node to filter the messages by topic. 

## Changelog

* v1.0.0 - Published module
* v1.0.1 - Added README.md (oops)
* v1.0.2 - Updated package.json
* v1.0.3 - Fixed issue that caused the Connect node to connect to localhost regardless of specified hostname
* v1.0.4 - Fixed typo that caused VoltageOutput voltageRange setting to behave strangely