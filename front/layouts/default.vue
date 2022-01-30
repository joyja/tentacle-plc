<template>
  <div>
    <header
      class="px-3 bg-slate-900 text-white flex items-center justify-between"
      style="height: 60px; min-width: 900px;"
    >
      <img style="height: 40px;" src="~/assets/tentacle.png" />
      <div class="flex items-center">
        PLC Status
        <div
          :class="`m-3 ${
            true ? 'bg-green-500' : 'bg-gray-500'
          } rounded-full w-5 h-5`"
        ></div>
      </div>
    </header>
    <Nuxt />
  </div>
</template>

<script>
export default {}
</script>
