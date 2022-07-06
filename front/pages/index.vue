<template>
  <div
    class="flex p-3 bg-slate-100 m-0 overflow-visible"
    style="min-height: calc(100vh - 60px)">
      <div class="flex flex-col" style="flex-basis: 300px">
        <div v-if="changes.length > 0" class="drop-shadow-md rounded bg-orange-200 my-3">
          <div class="flex items-center justify-between p-3 text-lg rounded-t text-white bg-orange-500">
            <div>Changes</div>
            <button 
              type="button" 
              class="ml-1 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
              @click="restartPLC"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="p-3">  
            <div v-for="(change, index) in changes" :key="index" class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" viewBox="0 0 20 20" fill="currentColor">
                <path v-if="change.event === 'change'" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                <path v-if="change.event === 'add'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                <path v-if="change.event === 'unlink'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg><div class="text-xs ml-3">{{change.path}}</div>
            </div>
          </div>
        </div>
      <div class="drop-shadow-md rounded bg-slate-300 my-3">
        <div class="p-3 text-lg rounded-t text-white bg-slate-500">
          Tasks
        </div>
        <div v-if="configuration.tasks && configuration.tasks.length > 0">
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
        <div v-else class="p-2">
          <p>There are no configured tasks.</p>
        </div>
      </div>
      <div class="drop-shadow-md rounded bg-slate-300 my-3">
        <div class="p-3 text-lg rounded-t text-white bg-slate-500">
          MQTT
        </div>
        <div v-if="configuration && configuration.mqtt && configuration.mqtt.length > 0">
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
        <div v-else class="p-2">
          There are no MQTT connections configured.
        </div>
      </div>
      <div class="drop-shadow-md rounded bg-slate-300 my-3">
        <div class="p-3 text-lg rounded-t text-white bg-slate-500">
          Modbus
        </div>
        <div v-if="configuration && configuration.modbus && configuration.modbus.length > 0">
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
        <div v-else class="p-2">
          <p>There are no Modbus connections configured.</p>
        </div>
      </div>
    </div>
    <div class="flex flex-col grow shrink" style="flex-basis: 600px; min-width: 600px;">
      <div class="m-3 drop-shadow-md rounded bg-slate-300">
        <div class="p-3 text-lg rounded-t text-white bg-slate-500">
          Global Variables
        </div>
        <div class="p-2">
          <div v-if="variablesDetailed && variablesDetailed.length > 0">
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
          <div v-else>
            <p>There are no global variables defined.</p>
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
              <a :href="`${codeserverEndpoint}`" class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600" target="_blank">
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
                @click="toggleCodeVisible({ codeName: code.name, codeType: code.type })"
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
import { mapState, mapGetters, mapActions } from 'vuex'
import Prism from '~/plugins/prism'
export default {
  asyncData({req}) {
    return {
      hostname: process.server ? req.headers.host.split(':')[0] : window.location.hostname
    }
  },
  data() {
    return {
      interval: null,
    }
  },
  computed: {
    codeserverEndpoint() {
      codeserverHost = process.env.TENTACLE_CODESERVER_HOST || this.hostname
      codeserverProtocol = process.env.TENTACLE_CODESERVER_PROTOCOL || 'http'
      codeserverPort = process.env.TENTACLE_CODESERVER_PORT || 8080
      codeserverUrl = process.env.TENTACLE_CODESERVER_URL || '/'
      return `${codeserverProtocol}://${codeserverHost}:${codeserverPort}${codeserverUrl}`
    },
    ...mapState([
        'values',
        'configuration',
        'metrics',
        'programs',
        'classes',
        'variables',
        'plc',
        'changes'
      ]),
    ...mapGetters([
      'codes',
      'variablesDetailed'
    ])
  },
  updated() {
    Prism.highlightAll()
  },
  mounted() {
    Prism.highlightAll()
    this.interval = setInterval(() => {
      this.fetchValues()
      this.fetchMetrics()
      this.fetchChanges()
    }, 1000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    toggle(path) {
      this.setValue({ 'variablePath':path, 'value': (!(this.values.find((value) => value.path === path).value === 'true')).toString() })
    },
    runFunction(path, args) {
      this.runFunction(path, args)
    },
    getTaskMetrics(taskName) {
      const metric = this.metrics.find((metric) => metric.task === taskName)
      return {
        intervalExecutionTime: metric ? parseFloat(metric.intervalExecutionTime).toFixed(2) : 0,
        functionExecutionTime: metric ? parseFloat(metric.functionExecutionTime).toFixed(2) : 0,
        intervalExecutionTimePercent: metric ? 100 * (metric.intervalExecutionTime / (metric.intervalExecutionTime + metric.functionExecutionTime)) : 0,
        functionExecutionTimePercent: metric ? 100 * (metric.functionExecutionTime / (metric.intervalExecutionTime + metric.functionExecutionTime)) : 0
      }
    },
    ...mapActions([
      'toggleCodeVisible',
      'fetchValues',
      'fetchMetrics',
      'fetchChanges',
      'setValue',
      'runFunction',
      'restartPLC'
    ])
  }
}
</script>

<style scoped>
  .jar-font-mono {
    font-family: Roboto Mono;
  }
</style>