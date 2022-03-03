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

The `variables.json` stores the configuration of all variables that will be store in the `global` object that is passed to all user programs and classes. TentaclePLC creates variables according to this file. See [Variables](/guide/variables) for configuration details.

### NPM files (package.json, package-lock.json, & node_modules)

Tentacle PLC uses npm workspaces to allow you to install 3rd party node modules to use in your programs and classes. Therefore, the runtime directory needs all of the standard node files. A great way to start with this is to run `npm init` within your runtime directory, which will ask you some questions and create the appropriate files for you.

After that you can use `npm install` to install your favorite npm packages.

### classes
The classes folder holds all class files. Classes are a way to template object-oriented code. See [this page](/guide/classes) for more information on classes.

### programs
The programs folder holds all program files. Programs are functions that can be assigned to tasks to run periodically. See [this page](/guide/programs) for more information on program.