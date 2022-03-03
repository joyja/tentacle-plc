# Programs & Tasks
Programs & Tasks provide the basic functionality of a traditional PLC, which is to run logic periodically. Programs are the logic to run and tasks are assigned a program to run and a rate at which to run the program periodically.

## Programs
All programs are `.js` files in the programs folder of the runtime directory. Programs are simply a javascript function that can take in variables as an argument (called `global`) and performs a bit of logic. Here is a simple example program that increments a counter every time it runs:

```javascript
module.exports = function ({ global }) {
  global.count = global.count + 1
}
```

Each program must export a javascript function using `module.exports`.

## Tasks
Tasks are configured in the `tasks` property of the `config.json` file of the runtime directory. See this example `config.json`:

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
```

This file would create two tasks. One task that runs the `main.js` program every 1000ms and one task that runs the `secondary.js` program every 2000ms.