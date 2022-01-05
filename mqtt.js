const sparkplug = require('sparkplug-client')

class Mqtt {
  constructor({
    serverUrl = 'tcp://localhost:1883',
    username,
    password,
    groupId,
    edgeNode,
    clientId,
    version = 'spBv1.0',
  }) {
    this.client = sparkplug.newClient({
      serverUrl,
      username,
      password,
      groupId,
      edgeNode,
      clientId,
      version,
    })
  }
}

module.exports = {
  Mqtt,
}
