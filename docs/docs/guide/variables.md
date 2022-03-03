# Variables

Variables are a storage location for program information. They can have an atomic data type (String, Number, Boolean, etc.) or they can be a class.

## variables.json

Variables are configured in `variables.json` in the `runtime` directory (see [Directory Structure](/guide/directory-structure.html#the-variables-json-file)). Here is an example:

```json
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
    "description": "Green stack light in JAR office.",
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
    "description": "The temperature in JAR office",
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

## Configuration Paramaters
Variables have the following configuration parameters.

### Description
`description` Pretty self explanatory, but this String value is used to give the variable a little extra context for humans.

### Initial Value
*Atomic variables only*
`initialValue` This sets the initial value of the variable on creation or on restart if the variable is persistent. 

### Persistence
*Atomic variables only*
`persistent` A Boolean value, if the variable is persistent it will retain it's value through a runtime restart (including hardware reboot). 

### External Source
*Atomic variables only*
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

### Class Configuration
*Classes only*
`config` This is used to initialize properties of a class. It's designed to handle customization of class logic depending on context. For exampe, you might have a `hasRunningInput` property on a motor class, allowing you to change logic based on whether a motor has a running input from the field or not. You can initialize that property for each motor class using `config`, setting it to `true` for motors that have a running input from the field and `false` for motors that do not.

## Using Variables

### In Programs
Variables are passed into programs as an object argment named `global`. Atomic variables will be a property of global named per the key given to it in `variables.json`.

See the following example program (`runtime/programs/main.js`):
```javascript
module.exports = function ({ global }) {
  global.count = global.count + 1
}
```

and example `variables.json`:
```json
{
  "count": {
    "datatype": "number",
    "initialValue": 0,
    "description": "The number of times the main task has been run.",
    "persistent": true
  }
}
```

As you can see, the variable count is accessed from the `global` object and incremented each time the program runs.

### In Classes

Similar to programs, variables are passed to the contructor of classes as an object named `global` along with the items in the `config` property of the class variable.

See the following example class (`runtime/classes/equipment.js`):
```javascript
class Equipment {
  constructor({ global }) {
    global.equipmentCount = global.equipmentCount + 1
  }
}

module.exports = [Equipment]
```

and example `variables.json`:
```json
{
  "equipmentCount": {
    "datatype": "number",
    "initialValue": 0,
    "description": "The total quantity of equipment instances."
  },
  "equipment1": {
    "description": "Equipment Number 1",
    "datatype": "Equipment"
  },
  "equipment2": {
    "description": "Equipment Number 1",
    "datatype": "Equipment"
  }
}
```