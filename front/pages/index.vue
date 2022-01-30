<template>
  <div
    class="flex p-3 bg-slate-100 m-0 overflow-visible"
    style="min-height: calc(100vh - 60px)">
    <div class="flex flex-col" style="flex-basis: 300px">
      <div class="drop-shadow-md rounded bg-slate-300 my-3">
        <div class="p-3 text-lg rounded-t text-white bg-slate-500">
          Tasks
        </div>
        <div
          v-for="task in configuration.tasks"
          :key="task.name"
        >
          <div class="pt-3 px-3 pb-1 flex justify-between items-center">
            <div class="flex flex-col">
              <p>{{ task.name }}</p>
              <p class="text-sm text-slate-600">{{ task.description }}</p>
            </div>
            <div class="grow px-3">
              <p class="text-right">{{ task.program }}.js</p>
            </div>
            <div class="flex items-center">
              <div class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-slate-700">
              <!-- Heroicon name: solid/pencil -->
                <p class="text-center text-xs leading-none">{{ task.scanRate }}</p>
                <p class="text-xs py-0 my-0 leading-none">ms</p>
              </div>
            </div>
          </div>
          <div class="flex justify-between text-slate-500">
            <div class="text-xs px-1">{{ getTaskMetrics(task.name).intervalExecutionTime }} ms</div>
            <div class="text-xs px-1">{{ getTaskMetrics(task.name).functionExecutionTime }} ms</div>
          </div>
          <div class="flex rounded-full mx-1 mb-1 overflow-hidden">
            <div class="bg-indigo-500" :style="{ 'height': '3px', 'flex-basis': `${getTaskMetrics(task.name).intervalExecutionTimePercent}%` }"></div>
            <div class="bg-green-500" :style="{ 'height': '3px', 'flex-basis': `${getTaskMetrics(task.name).functionExecutionTimePercent }%`}"></div>
          </div>
        </div>
      </div>
      <div class="drop-shadow-md rounded bg-slate-300 my-3">
        <div class="p-3 text-lg rounded-t text-white bg-slate-500">
          MQTT
        </div>
        <div
          v-for="mqtt in configuration.mqtt"
          :key="mqtt.name"
        >
          <div class="pt-3 px-3 pb-1 flex justify-between items-center">
            <div class="flex flex-col">
              <p>{{ mqtt.name }}</p>
              <p class="text-sm text-slate-600">{{ mqtt.description }}</p>
              <p class="text-sm text-slate-600">{{ mqtt.config.serverUrl }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="drop-shadow-md rounded bg-slate-300 my-3">
        <div class="p-3 text-lg rounded-t text-white bg-slate-500">
          Modbus
        </div>
        <div
          v-for="modbus in configuration.modbus"
          :key="modbus.name"
        >
          <div class="pt-3 px-3 pb-1 flex justify-between items-center">
            <div class="flex flex-col">
              <p>{{ modbus.name }}</p>
              <p class="text-sm text-slate-600">{{ modbus.description }}</p>
              <p class="text-sm text-slate-600">tcp://{{ modbus.config.host }}:{{ modbus.config.port}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col grow shrink" style="flex-basis: 600px; min-width: 600px;">
      <div class="m-3 drop-shadow-md rounded bg-slate-300">
        <div class="p-3 text-lg rounded-t text-white bg-slate-500">
          Global Variables
        </div>
        <div class="p-2">
          <div v-for="variable in variablesDetailed" :key="variable.name">
            <div class="flex justify-between py-1">
              <div class="pr-5 flex items-center">
                <p class="pr-1">{{ variable.name }}</p>
                <div v-if="variable.persistent" class="inline-flex items-center justify-center p-1 rounded-full text-white bg-slate-400 text-xs" style="height: 20px; width: 20px; margin-right: 1px;">P</div>
                <div v-if="variable.source" class="inline-flex items-center p-1 border border-transparent rounded-full text-white bg-slate-400">
                  <!-- Heroicon name: solid/plus-sm -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>    
                </div>
              </div>
              <div v-if="variable.value">
                <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
                <button v-if="variable.datatype === 'boolean'" type="button" :class="[variable.value === 'true' ? 'bg-orange-400' : 'bg-gray-400', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500']" role="switch" :aria-checked="variable.value === 'true'" @click="toggle(variable.path)">
                  <span class="sr-only">Use setting</span>
                  <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
                  <span aria-hidden="true" :class="[variable.value === 'true' ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']"></span>
                </button>
                <button v-else-if="variable.datatype === 'string' && variable.value==='function0'" type="button" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-slate-600 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500" @click="runFunction(variable.name)">
                  Run Function
                </button>
                <div v-else class="font-mono text-right">{{ variable.datatype === 'number' ? Math.round((parseFloat(variable.value) + Number.EPSILON)* 100)/100 : variable.value }}</div>
              </div>
            </div>
            <div v-if="variable.values" class="flex flex-col">
              <div v-for="property in variable.values" :key="property.name" class="flex justify-between py-1">
                <div class="pr-5 flex items-center">
                  <div class="text-slate-400 pb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 16L14.5 21.5L13.08 20.09L16.17 17H10.5C6.91 17 4 14.09 4 10.5V4H6V10.5C6 13 8 15 10.5 15H16.17L13.09 11.91L14.5 10.5L20 16Z"/>
                    </svg>
                  </div>
                  <p class="pr-1">
                    {{ property.name }}
                  </p>
                  <div v-if="property.persistent" class="inline-flex items-center justify-center p-1 rounded-full text-white bg-slate-400 text-xs h-5 w-5">P</div>
                  <div v-if="property.source" class="inline-flex items-center p-1 border border-transparent rounded-full text-white bg-slate-400">
                    <!-- Heroicon name: solid/plus-sm -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>    
                  </div>
                </div>
                <div class="flex">
                  <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
                  <button v-if="property.datatype === 'boolean'" type="button" :class="[property.value === 'true' ? 'bg-orange-400' : 'bg-gray-400', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500']" role="switch" :aria-checked="property.value === 'true'" @click="toggle(property.path)">
                    <span class="sr-only">Use setting</span>
                    <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
                    <span aria-hidden="true" :class="[property.value === 'true' ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']"></span>
                  </button>
                  <button v-else-if="property.datatype === 'string' && property.value==='function0'" type="button" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-slate-600 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500" @click="runFunction(property.path)">
                    Run Function
                  </button>
                  <div v-else class="font-mono text-right">{{ property.datatype === 'number' ? Math.round((parseFloat(property.value) + Number.EPSILON)* 100)/100 : property.value }}</div>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
      <div 
        v-for="code in codes" 
        :key="`${code.type}-${code.name}`" 
        :class="{
          'transition-all': 'true', 
          'duration-300': true, 
          'm-3': true, 
          'drop-shadow-md': true, 
          'rounded-t': true,
          'rounded-b': true,
          'bg-slate-300': true,
          'overflow-hidden': true,
        }"
        :style="{'max-height': code.visible ? '100%' : '58px'}"
      >
        <div 
          :class="{
            'p-3': true,
            'text-lg': true,
            'rounded-t': true,
            'rounded-b': !code.visible,
            'text-white': true,
            'bg-slate-500': true,
            'flex': true,
            'justify-between': true,
          }"
        >
          <div class="flex items-center">
              <a :href="`http://${hostname}:8080`" class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600" target="_blank">
              <!-- Heroicon name: solid/pencil -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </a>
              <div class="pl-2">{{ code.name }}</div>
            </div>
            <div class="flex">
              <div class="pr-2">{{ code.type }}</div>
              <button 
                type="button" 
                class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
                @click="toggleCodeVisible(code.name, code.type)"
              >
              <!-- Heroicon name: solid/pencil -->
                <svg xmlns="http://www.w3.org/2000/svg" 
                  :class="{ 'transition-all': true, 'duration-300': true, 'h-6': true, 'w-6': true, 'rotate-180': code.visible }" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
        </div>
        <div 
          :class="{ 'overflow-hidden': true, 'px-2': true }"
        >
          <pre class="rounded language-javascript"><code class="language-javascript">{{ code.code }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Prism from '~/plugins/prism'
const query = function(queryName, query){
  let endpoint
  if (process.client) {
    endpoint = `http://${window.location.hostname}:4000`
  } else {
    endpoint = `http://localhost:4000`
  }
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then((r) => r.json())
    .then((data) => data.data[queryName])
}
const queryValues = function () {
  return query('values', `query Values {
      values {
        path
        value
        datatype
      }
    }`)
}
const queryVariables = function () {
  return query('variables', `query Variables {
  variables {
    name
    description
    datatype
    initialValue
    persistent
    children{
      name
      description
      datatype
      initialValue
      persistent
    }
    source {
      name
      type
      rate
      params {
        register
      }
    }
  }
}`)
}
const queryConfig = function () {
  return query( 'configuration', `query Configuration {
      configuration {
        tasks {
          name
          description
          scanRate
          program
        }
        mqtt {
          name
          description
          config {
            serverUrl
          }
        }
        modbus {
          name
          description
          config {
            host
            port
          }
        }
      }
    }`)
}
const queryMetrics = function () {
    return query('metrics',`query Metrics {
      metrics {
        task
        functionExecutionTime,
        intervalExecutionTime,
        totalScanTime
      }
    }`)
}
const queryPrograms = function () {
  return query('programs', `query Programs {
    programs
  }`)
}
const queryClasses = function () {
  return query('classes', `query Classes {
    classes
  }`)
}
const queryProgram = function (selector) {
  return query('program', `query Program {
    program(name: "${selector}")
  }`)
}
const queryClass = function (selector) {
  return query('class', `query Class {
    class(name: "${selector}")
  }`)
}
const setValue = function (variablePath, value) {
  return query('setValue', `mutation SetValue {
    setValue(
      variablePath: "${variablePath}"
      value: "${value}"
    ) {
      path
      value
      datatype
    }
  }`)
}
const runFunction = function (functionPath, args) {
  return query('runFunction', `mutation RunFunction {
    runFunction(
      functionPath: "${functionPath}"
      args: "${JSON.stringify(args)}"
    )
  }`)
}
export default {
  async asyncData({req}) {
    return {
      values: await queryValues(),
      configuration: await queryConfig(),
      metrics: await queryMetrics(),
      programs: await queryPrograms().then((result) => {
        return result.reduce((acc, program) => {
          return {
            ...acc,
            [program]: {
              visible: false,
              loading: false,
              code: ''
            }
          }
        },{})
      }),
      // codeMain: await queryProgram('main.js'),
      classes: await queryClasses().then((result) => {
        return result.reduce((acc, cls) => {
          return {
            ...acc,
            [cls]: {
              visible: false,
              loading: false,
              code: ''
            }
          }
        },{})
      }),
      // codeMotor: await queryClass('motor.js'),
      variables: await queryVariables(),
      hostname: process.server ? req.headers.host.split(':')[0] : window.location.hostname
    }
  },
  data() {
    return {
      interval: null
    }
  },
  computed: {
    codes() {
      return [
        ...Object.keys(this.programs).map((key) => {
          return {
            name: key,
            type: 'program',
            ...this.programs[key],
          }
        }),
        ...Object.keys(this.classes).map((key) => {
          return {
            name: key,
            type: 'class',
            ...this.classes[key],
          }
        })
      ]
    },
    variablesDetailed() {
      return this.variables.map((variable) => {
        const atomicTypes = ['string', 'boolean', 'number']
        const contextParams = {}
        if (atomicTypes.includes(variable.datatype)) {
          const value = this.values.find((value) => value.path === variable.name)
          if (value.datatype === 'string' && 'function' in value.value) {
            contextParams.datatype = 'function'
            contextParams.argumentCount = parseInt(value.value.replace('function',''))
          } else {
            contextParams.datatype = value.datatype
            contextParams.value = value.value
          }
        } else {
          const children = variable.children.map((child) => {
            const value = this.values.find((value) => value.path === `${variable.name}.${child.name}`).value
            return {
              ...child,
              value
            }
          })
          const values = this.values
            .filter((value) => value.path.split('.')[0] === variable.name)
            .map((value) => {
              const child = children.find((child) => child.name === value.path.split('.').slice(1).join('.')) || {} 
              return {
                name: value.path.split('.').slice(1).join('.'),
                path: value.path,
                datatype: child.datatype ? child.datatype : value.datatype,
                value: value.value,
                ...child
              }
            })
          contextParams.values = values
        }
        return {
          ...variable,
          ...contextParams,
        }
      }) 
    }
  },
  updated() {
    Prism.highlightAll()
  },
  mounted() {
    Prism.highlightAll()
    this.interval = setInterval(() => {
      queryValues().then((result) => {
        this.values = result
      })
      queryMetrics().then((result) => {
        this.metrics = result
      })
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    toggle(path) {
      setValue(path, !(this.values.find((value) => value.path === path).value === 'true'))
    },
    runFunction(path, args) {
      runFunction(path, args)
    },
    getTaskMetrics(taskName) {
      const metric = this.metrics.find((metric) => metric.task === taskName)
      return {
        intervalExecutionTime: parseFloat(metric.intervalExecutionTime).toFixed(2),
        functionExecutionTime: parseFloat(metric.functionExecutionTime).toFixed(2),
        intervalExecutionTimePercent: 100 * (metric.intervalExecutionTime / (metric.intervalExecutionTime + metric.functionExecutionTime)),
        functionExecutionTimePercent: 100 * (metric.functionExecutionTime / (metric.intervalExecutionTime + metric.functionExecutionTime))
      }
    },
    toggleCodeVisible(codeName, codeType) {
      if (codeType === 'program') {
        this.toggleProgramVisible(codeName)
      } else {
        this.toggleClassVisible(codeName)
      }
    },
    toggleProgramVisible(name) {
      if (this.programs[name].visible) {
        this.programs[name].visible = false
      } else {
        this.getProgram(name)
      }
    },
    getProgram(name) {
      this.programs[name] = {
        visible: true,
        loading: true,
        code: ''
      }
      queryProgram(name).then((result) => {
        this.programs[name].loading = false
        this.programs[name].code = result
      })
    },
    toggleClassVisible(name) {
      if (this.classes[name].visible) {
        this.classes[name].visible = false
      } else {
        this.getClass(name)
      }
    },
    getClass(name) {
      this.classes[name] = {
        visible: true,
        loading: true,
        code: ''
      }
      queryClass(name).then((result) => {
        this.classes[name].loading = false
        this.classes[name].code = result
      })
    }
  }
}
</script>

<style scoped>
  .jar-font-mono {
    font-family: Roboto Mono;
  }
</style>