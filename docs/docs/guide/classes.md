# Classes

Classes allow you to use Javascript classes to create object oriented logic and properties that can be assigned to variables.

Once you create a class in the `classes` folder of the `runtime` directory, you can use it as a datatype for variables. For example, if you made this class `runtime/classes/switch.js`:

```javascript
class Switch {
  constructor() {
    this._isOn = false
  }
  set isOn(value) {
    if (value !== this._isOn ) {
      this.stateChangeCount += 1
    }
    this._isOn = value
  }
  get isOn() {
    return this._isOn
  }
}
Motor.variables = {
  '_isOn': {
    description: 'Total start count',
    datatype: 'boolean',
    initialValue: false,
    persistent: true,
  },
  stateChangeCount: {
    description: 'Quantity of state changes',
    datatype: 'number',
    initialValue: 0,
    peristent: true,
  }
}
```

You can then use the `Switch` datatype in `variables.json` like this:

```json
{
  "switch1": {
    "description": "The first switch",
    "datatype": "Switch"
  },
  "switch2": {
    "description": "The second switch",
    "datatype": "Switch"
  }
}
```

These instances can then be accessed from within any program or any other class with the `global` variable, for example (in a program called `/runtime/programs/checkSwitch.js`):

```javascript
module.exports = function({ global }) {
  if (global.switch1.isOn && !global.switch2.isOn) {
    // Do Something!
  }
}
```

## Class Variables
You can use the `variables` property of a class to add features to properties of a class. All of the features that are available for variables (See [Variables]('/guide/variables')) are available for class properties this way, except that you currently cannot set the datatype of a property to a class (though we might add that capability in the future).