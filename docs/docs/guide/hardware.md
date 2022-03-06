# Example Hardware Architecture

<Mermaid :value="`
  flowchart TD
    a(Tentacle PLC)
    b(Tentacle PLC UI)
    c(Code Server)
    d(Web Browser)
    e(MQTT Broker)
    f(MQTT Client)
    g(remote I/O)
    f <--> e
    d --> b & c
    e <-- Sparkplug B --> a
    subgraph ipc[Linux IPC]
    subgraph Docker
    b & c --> a
    end
    end
    a <--> g
`"/>