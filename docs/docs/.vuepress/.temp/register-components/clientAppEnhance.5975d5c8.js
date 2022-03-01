import { defineAsyncComponent } from 'vue'

export default ({ app }) => {
  app.component("Tentacle", defineAsyncComponent(() => import("/home/ubuntu/vuepress-test/docs/.vuepress/components/Tentacle.vue"))),
  app.component("TentacleHome", defineAsyncComponent(() => import("/home/ubuntu/vuepress-test/docs/.vuepress/components/TentacleHome.vue")))
}
