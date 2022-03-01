import { defineAsyncComponent } from 'vue'

export default ({ app }) => {
  app.component("Tentacle", defineAsyncComponent(() => import("/home/ubuntu/tentacle-plc/docs/docs/.vuepress/components/Tentacle.vue"))),
  app.component("TentacleHome", defineAsyncComponent(() => import("/home/ubuntu/tentacle-plc/docs/docs/.vuepress/components/TentacleHome.vue")))
}
