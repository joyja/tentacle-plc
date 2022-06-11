# GraphQL

Tentacle PLC has a GraphQL API which allows external applications (like REST clients and Tentacle PLC) to interact with it programmatically.

<!-- START graphql-markdown -->

# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Mutation](#mutation)
  * [Objects](#objects)
    * [Plc](#plc)
    * [Variable](#variable)
    * [VariableSource](#variablesource)
    * [VariableSourceParams](#variablesourceparams)
    * [atomicVariable](#atomicvariable)
    * [change](#change)
    * [config](#config)
    * [configModbus](#configmodbus)
    * [configModbusConfig](#configmodbusconfig)
    * [configMqtt](#configmqtt)
    * [configMqttConfig](#configmqttconfig)
    * [configTask](#configtask)
    * [taskMetric](#taskmetric)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [Float](#float)
    * [Int](#int)
    * [String](#string)

</details>

## Query
Read only queries

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>info</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Information about the Tentacle PLC environment as a string.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>metrics</strong></td>
<td valign="top">[<a href="#taskmetric">taskMetric</a>!]!</td>
<td>

Task diagnostic data

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#atomicvariable">atomicVariable</a></td>
<td>

Single value of an atomic variable or class property.Example path for classes: motor1.running where motor1 is the class instance and running is a property of motor1's class.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">variablePath</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>values</strong></td>
<td valign="top">[<a href="#atomicvariable">atomicVariable</a>!]!</td>
<td>

Lists all variable and class property values

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>variables</strong></td>
<td valign="top">[<a href="#variable">Variable</a>!]!</td>
<td>

Lists all variables

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>programs</strong></td>
<td valign="top">[<a href="#string">String</a>!]!</td>
<td>

Lists all programs

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>program</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Returns the code for a single program

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>classes</strong></td>
<td valign="top">[<a href="#string">String</a>!]!</td>
<td>

Lists all classes

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>class</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Returns the code for a single class

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>configuration</strong></td>
<td valign="top"><a href="#config">config</a>!</td>
<td>

The current configration

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>changes</strong></td>
<td valign="top">[<a href="#change">change</a>!]!</td>
<td>

Lists all file changes that have occurred since the last PLC restart

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>plc</strong></td>
<td valign="top"><a href="#plc">Plc</a>!</td>
<td>

The PLC status information

</td>
</tr>
</tbody>
</table>

## Mutation
Read/Write queries

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>setValue</strong></td>
<td valign="top"><a href="#atomicvariable">atomicVariable</a></td>
<td>

Sets the value of an atomic variable. Can only target a single atomic variable or the property of a class. 
Example path for classes: motor1.running where motor1 is the class instance and running is a property of motor1's class.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">variablePath</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">value</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>runFunction</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Run the function of a class.Example path for classes: motor1.start where motor1 is the class instance and start is a property of motor1's class.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">functionPath</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">args</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>startPlc</strong></td>
<td valign="top"><a href="#plc">Plc</a></td>
<td>

Start the PLC runtime if stopped.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stopPlc</strong></td>
<td valign="top"><a href="#plc">Plc</a></td>
<td>

Stop the PLC runtime.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>restartPlc</strong></td>
<td valign="top"><a href="#plc">Plc</a></td>
<td>

Stop the PLC runtime, if running, and the start the PLC with the latest runtime configration.

</td>
</tr>
</tbody>
</table>

## Objects

### Plc

PLC status and diagnostics information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>running</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Variable

Variable configuration

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>datatype</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>initialValue</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>persistent</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>source</strong></td>
<td valign="top"><a href="#variablesource">VariableSource</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>children</strong></td>
<td valign="top">[<a href="#variable">Variable</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### VariableSource

Variable external source basic configuration

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>rate</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>params</strong></td>
<td valign="top"><a href="#variablesourceparams">VariableSourceParams</a></td>
<td></td>
</tr>
</tbody>
</table>

### VariableSourceParams

Variable exertnal source parameters, used to configure the source specific to the protocol used

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>register</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>registerType</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>format</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### atomicVariable

Atomic Variable type used for String, Numbers, and Booleans

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>path</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>datatype</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### change

File change type to use for change log (since last runtime update)

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>event</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>path</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### config

Overall Tentacle PLC configration

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>tasks</strong></td>
<td valign="top">[<a href="#configtask">configTask</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mqtt</strong></td>
<td valign="top">[<a href="#configmqtt">configMqtt</a>!]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>modbus</strong></td>
<td valign="top">[<a href="#configmodbus">configModbus</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### configModbus

Modbus client basic configuration

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>config</strong></td>
<td valign="top"><a href="#configmodbusconfig">configModbusConfig</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### configModbusConfig

Modbus client configuration

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>host</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>port</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unitId</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>reverseBits</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>reverseWords</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>zeroBased</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>retryRate</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

### configMqtt

MQTT Client basic configuration

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>config</strong></td>
<td valign="top"><a href="#configmqttconfig">configMqttConfig</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### configMqttConfig

Mqtt client configuration

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>serverUrl</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>groupId</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>username</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>edgeNode</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>deviceName</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>clientId</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### configTask

Task configuration

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>scanRate</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>program</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### taskMetric

Task metrics for diagnostic data

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>task</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>functionExecutionTime</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>intervalExecutionTime</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalScanTime</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.


<!-- END graphql-markdown -->

## Examples

- Query - PLC Running Status
  - Body:

    ```
    query {
      plc {
          running
        }
      }
    ```
  - Response:

    ```
    {
      "data": {
          "plc": {
            "running": true
          }
      }
    }
    ```
  - Postman Snippet:

    ![image](https://user-images.githubusercontent.com/48938478/173172679-44f543aa-98b6-4c17-b164-bdc50395d510.png)

- Mutation - Restart PLC
  - Body:
    ```
    mutation {
      restartPlc {
        running
      }
    }
    ```

  - Response:
    ```
    {
      "data": {
          "restartPlc": {
            "running": true
        }
      }
    }
    ```

  - Postman Snippet:

    ![image](https://user-images.githubusercontent.com/48938478/173172788-6b619ec9-cd23-4bab-a586-5b417edf8201.png)
