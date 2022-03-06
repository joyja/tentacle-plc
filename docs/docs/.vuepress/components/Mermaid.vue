<template>
  <figure 
    class="diagram"
    :style="{'min-height': '416px', 'opacity': loaded ? 1 : 0, 'transition': 'all .3s ease-in' }"
    v-html="svg"
  />
</template>

<style scoped>
.diagram {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0rem;
  cursor: pointer;
}

.zoomed.diagram {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: var(--c-bg);
  margin: 0;
}
</style>

<script>
export default {
  props: {
    value: { require: true, type: String }
  },
  data() {
    return {
      loaded: false,
      mermaid: null,
      svg: "",
      zoomed: false,
      darkModeObserver: null,
    }
  },
  methods: {
    render() {
      console.log(this.isDarkMode())
      if (this.mermaid) {
        this.mermaid.initialize({
          startOnLoad: false,
          theme: this.isDarkMode() ? "dark" : "neutral",
        })

        this.mermaid.render(`diagram_hardware`, this.value, (svg) => {
          this.svg = svg
        });
      }
    },
    toggleZoom() {
      this.zoomed = !this.zoomed;
    },
    isDarkMode() {
      return document.documentElement.classList.contains("dark");
    }
  },
  async mounted() {
    this.mermaid = mermaid
    this.darkModeObserver = new MutationObserver(this.render)
    this.darkModeObserver.observe(document.documentElement, {
      attributeFilter: ["class"],
    })
    this.render()
    this.loaded = true
    console.log(mermaid)
  },
  unmounted() {
    this.darkModeObserver.disconnect();
  },
 
}
</script>