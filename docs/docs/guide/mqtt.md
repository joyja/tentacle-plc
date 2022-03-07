# MQTT

Tentacle PLC publishes it's variables to every configured MQTT broker. 

## Configuration

Connections to MQTT brokers are configured in `config.json` (see [Configuration](/guide/configuration)). See this example `mqtt` key of  `config.json`:

```json
{
  "mqtt" : {
    "mosquitto1": {
      "description": "Mosquitto Server 1",
      "rate": 1000,
      "config": {
        "serverUrl": "ssl://192.168.1.3:1883",
        "groupId": "group1",
        "username": "user",
        "password": "password",
        "edgeNode": "edgeNode1",
        "deviceName": "tentaclePlc1",
        "clientId": "tentaclePlc1",
        "version": "spBv1.0"
      }
    }
  }
}
```

### Description
`description`

### Rate
`rate`

### Config
`config`

## Variables

Each variable in `variables.json` (See [Variables](/guide/variables)) is published using the Sparkplug B specification.

For example, a simple `variables.json` like this:

```json
{
"count": {
  "datatype": "number",
  "initialValue": 0,
  "description": "A counter.",
  "persistent": true
}
```

with the mqtt configuration shown above Tentacle PLC will publish data on the topic `spBV1.0/group1/DDATA/edgeNode1/tentaclePLC1` to the mosquitto1 broker, and the structure of the payload will look something like this:

```json
{
  "`timestamp": 1486144502122,
  "metrics": [{
    "name": "count",
    "timestamp": 1486144502122,
    "dataType": "Int32",
    "`value": 0
  }],
  "seq": 0
}
```

::: tip
  If the datatype of the variableis `number`, TentaclePLC will determine the `dataType` for you based on the value of the variable.
:::

Tentacle PLC implements all of the features of MQTT Sparkplug B. If you'd like to learn more about it you can read [the specification](https://www.eclipse.org/tahu/spec/Sparkplug%20Topic%20Namespace%20and%20State%20ManagementV2.2-with%20appendix%20B%20format%20-%20Eclipse.pdf) from the Eclipse Foundation.

## Classes

All properties and functions of class instances are published as well, regardless of whether they are set in the `variables` property of the class.

### Functions

Class functions are a little different than other properties. If a function has no arguments, it will be published as a `boolean` datatype and a remote client can run the function on Tentacle PLC by setting the boolean value to `true`. If a function has arguments, the function can be run by publishing an appropriately formatted json string with the arguments in it.

## Example Using Ignition

Here's an example using Inducutive Automation's Ignition, a modern HMI software that is compatible Sparkplug B:

With the following files:

::: details /runtime/variables.js
``` json
{
  "count": {
    "datatype": "number",
    "initialValue": 0,
    "description": "The number of times the main task has been run.",
    "persistent": true
  },
  "countSecondary": {
    "datatype": "number",
    "initialValue": 0,
    "description": "The number of times the secondary task has been run.",
    "persistent": true
  },
  "tone": {
    "datatype": "boolean",
    "initialValue": false,
    "description": "Tone on stack light in JAR office.",
    "persistent": true,
    "source": {
      "type": "modbus",
      "name": "ioThinx4510",
      "rate": 1000,
      "params": {
        "register": 2,
        "registerType": "COIL",
        "format": "BOOLEAN"
      }
    }
  },
  "greenLight": {
    "datatype": "boolean",
    "initialValue": false,
    "description": "Red stack light in JAR office.",
    "persistent": true,
    "source": {
      "type": "modbus",
      "name": "ioThinx4510",
      "rate": 1000,
      "params": {
        "register": 1,
        "registerType": "COIL",
        "format": "BOOLEAN"
      }
    }
  },
  "redLight": {
    "datatype": "boolean",
    "initialValue": false,
    "description": "Red stack light in JAR office.",
    "persistent": true,
    "source": {
      "type": "modbus",
      "name": "ioThinx4510",
      "rate": 1000,
      "params": {
        "register": 0,
        "registerType": "COIL",
        "format": "BOOLEAN"
      }
    }
  },
  "officeTemp": {
    "description": "The temperature in James' office",
    "datatype": "number",
    "initialValue": 0,
    "persistent": true,
    "source": {
      "type": "modbus",
      "name": "groovEpic",
      "rate": 1000,
      "params": {
        "register": 4865,
        "registerType": "INPUT_REGISTER",
        "format": "FLOAT"
      }
    }
  },
  "motor1": {
    "description": "A really great motor",
    "datatype": "Motor",
    "config": {
      "hasRunningInput": false,
      "name": "motor1"
    }
  }
}
```
:::

::: details /runtime/classes/motor.js
``` javascript
class Motor {
  constructor({ hasRunningInput }) {
    this.functionsFeedback = ''
    this.hasRunningInput = hasRunningInput
    this.prevRunning = false
    this.runtime = 0
    this.startCount = 0
    this.startCommand = true
    this.mode = 'manual'
    this.runtimeInterval = setInterval(() => {
      if (this.running) {
        this.runtime = this.runtime + 1 / 60
      }
      if (this.running && !this.prevRunning) {
        this.startCount = this.startCount + 1
        this.prevRunning = this.running
      }
      if (!this.running && this.prevRunning) {
        this.prevRunning = false
      }
    }, 1000)
  }
  autoRequest() {
    this.mode = 'auto'
    this.functionsFeedback = `${this.name} placed in auto mode.`
  }
  manualRequest() {
    this.mode = 'manual'
    this.functionsFeedback = `${this.name} placed in manual mode.`
  }
  startRequest() {
    if (this.mode === 'manual') {
      this.startCommand = true
      this.functionsFeedback = `${this.name} manually started.`
    } else {
      this.functionsFeedback = `${this.name} cannot be started manually when it is in auto mode.`
    }
  }
  stopRequest() {
    if (this.mode === 'manual') {
      this.startCommand = false
      this.functionsFeedback = `${this.name} manually stopped.`
    } else {
      this.functionsFeedback = `${this.name} cannot be stopped manually when it is in manual mode.`
    }
  }
  get running() {
    if (this.hasRunningInput) {
      return this.runningInput
    } else {
      return this.startCommand
    }
  }
  set running(value) {
    this.startCommand = value
  }
}
Motor.variables = {
  startCount: {
    description: 'Total start count',
    datatype: 'number',
    initialValue: 0,
    persistent: true,
  },
  runtime: {
    description: 'Total runtime',
    datatype: 'number',
    initialValue: 0,
    persistent: true,
  },
  mode: {
    description: 'Current mode (i.e. auto/manual)',
    datatype: 'string',
    initialValue: false,
    persistent: true,
  },
  startCommand: {
    description: 'Start output to the motor.',
    datatype: 'boolean',
    initialValue: false,
    persistent: true,
  },
  prevRunning: {
    description: 'The motor was running during the previous scan.',
    datatype: 'boolean',
    initialValue: false,
    persistent: true,
  },
}

module.exports = [Motor]
```
:::