import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/",{"title":"Home"},["/index.html","/README.md"]],
  ["v-fffb8e28","/guide/",{"title":"Introduction"},["/guide/index.html","/guide/README.md"]],
  ["v-5beb675f","/guide/classes.html",{"title":""},["/guide/classes","/guide/classes.md"]],
  ["v-4f4ccb8f","/guide/configuration.html",{"title":""},["/guide/configuration","/guide/configuration.md"]],
  ["v-040800dc","/guide/directory-structure.html",{"title":"Directory Structure"},["/guide/directory-structure","/guide/directory-structure.md"]],
  ["v-fb0f0066","/guide/getting-started.html",{"title":"Getting Started"},["/guide/getting-started","/guide/getting-started.md"]],
  ["v-633764c9","/guide/mqtt.html",{"title":""},["/guide/mqtt","/guide/mqtt.md"]],
  ["v-20be7ca4","/guide/variables.html",{"title":""},["/guide/variables","/guide/variables.md"]],
  ["v-3706649a","/404.html",{"title":""},["/404"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, meta, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta,
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)
