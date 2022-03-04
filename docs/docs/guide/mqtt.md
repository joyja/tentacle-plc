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