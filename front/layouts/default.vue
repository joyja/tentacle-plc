<template>
  <div>
    <header
      class="px-3 bg-slate-900 text-white flex items-center justify-between"
      style="height: 60px; min-width: 900px;"
    >
      <img style="height: 40px;" src="~/assets/tentacle.png" />
      <div class="flex items-center">
        <div class="flex items-center">
          PLC Status
          <div
            :class="`m-3 ${
              plc.running ? 'bg-green-500' : 'bg-gray-500'
            } rounded-full w-5 h-5 transition-all duration-700`"
          ></div>
        </div>
        <button 
          v-if="plc.running"
          type="button" 
          class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
          @click="stopPLC"
        >
        <!-- Heroicon name: outline/pencil -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button 
          v-else
          type="button" 
          class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
          @click="startPLC"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
         <button 
          type="button" 
          class="ml-1 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
          @click="restartPLC"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
    <Nuxt />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState([
      'plc'
    ])
  },
  methods: {
    ...mapActions([
      'startPLC',
      'stopPLC',
      'restartPLC'
    ])
  }
}
</script>
