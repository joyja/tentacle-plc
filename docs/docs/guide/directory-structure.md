# Directory Structure

Tentacle PLC looks for resources in specific folders within the current working directory.

## The runtime directory

This is the folder that holds all user configuration and programs. Here is an example of the basic structure:

![Tentacle PLC Directory Structure](https://res.cloudinary.com/jarautomation/image/upload/v1646032003/Tentacle%20PLC%20Docs/tentacle-plc-directory-structure.png)

This folder should include the following:

### The config.json file

The `config.json` file stores the configuration for Tentacle PLC, including tasks, mqtt, and modbus. It's in json format and here is an example with the most commonly used settings:

```json
{
  "tasks" : {
    "main": {
      "description": "The main task",
      "scanRate": 1000,
      "program": "main"
    },
    "secondary": {
      "description": "A less important task",
      "scanRate": 2000,
      "program": "secondary"
    }
  },
  "mqtt" : {
    "mosquitto1": {
      "description": "JAR Automation Cluster MQTT",
      "rate": 1000,
      "config": {
        "serverUrl": "tcp://192.168.1.1:1883",
        "groupId": "Group1",
        "username": "user",
        "password": "password",
        "edgeNode": "Edge1",
        "deviceName": "Tentacle1",
        "clientId": "Edge1",
        "version": "spBv1.0"
      }
    }
  },
  "modbus" : {
    "ModbusDevice1": {
      "description": "Modbus Device",
      "config": {
        "host": "192.168.1.2",
        "port": 502,
        "unitId": 0,
        "reverseBits": false,
        "reverseWords": false,
        "zeroBased": false,
        "retryRate": 5000
      }
    }
  }
}
```

### The variables.json file

The `variables.json` stores the configuration of all variables that will be store in the `global` object that is passed to all user programs and classes. TentaclePLC creates variables according to this file. It allows for the following features to be applied to each variable:

#### Description
`description` Pretty self explanatory, but this String value is used to give the variable a little extra context for humans.

#### Initial Value
`initialValue` This sets the initial value of the variable on creation or on restart if the variable is persistent.

#### Persistence
`persistent` A Boolean value, if the variable is persistent it will retain it's value through a runtime restart (including hardware reboot).

#### External Source
`source` Setting this syncs the value of the variable with an external source over a communications protocol (like Modbus). If the value of the address in the external source changes, the value of the variable will change. If the external source allows for writes and Tentacle PLC changes the value of the variable, Tentacle PLC will attempt to write the new value to the external source.

The structure depends on which protocol you are using but an example for Modbus TCP looks like this:

```json
{
  "type": "modbus",
  "name": "ModbusDevice1",
  "rate": 1000,
  "params": {
    "register": 1,
    "registerType": "COIL",
    "format": "BOOLEAN"
  }
}
```

### NPM files (package.json, package-lock.json, & node_modules)

Tentacle PLC uses npm workspaces to allow you to install 3rd party node modules to use in your programs and classes. Therefore, the runtime directory needs all of the standard node files. A great way to start with this is to run `npm init` within your runtime directory, which will ask you some questions and create the appropriate files for you.

After that you can use `npm install` to install your favorite npm packages.