const { path } = require('@vuepress/utils')
const { defaultTheme } = require('@vuepress/theme-default')
const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')

module.exports = {
  // site config
  lang: 'en-US',
  title: 'Tentacle PLC',
  description: 'A modern software programmable logic controller',
  head: [['script', { async: true, src: 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js' }]],
  // bundler: 'vuepress-webpack',

  // theme and its config
  theme: defaultTheme({
    logo: 'https://res.cloudinary.com/jarautomation/image/upload/f_auto/c_scale,h_53/v1620021619/logos/tentacle-light.png',
    logoDark: 'https://res.cloudinary.com/jarautomation/image/upload/f_auto/c_scale,h_53/v1595057073/logos/tentacle.png',
    docsRepo: 'https://github.com/joyja/tentacle-plc',
    docsBranch: 'main',
    docsDir: 'docs/docs',
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          children: [
            '/guide/README.md',
            '/guide/getting-started.md',
            '/guide/directory-structure.md',
            '/guide/variables.md',
            '/guide/tasks-and-programs.md',
            '/guide/classes.md',
            '/guide/graphql.md',
            '/guide/mqtt.md',
            '/guide/user-interface.md',
            '/guide/architecture.md'
          ],
        },
      ],
    }
  }),
  plugins: [
    [
      registerComponentsPlugin({
        componentsDir: path.resolve(__dirname, './components'),
      }),
    ],
  ],
  alias: {
    '@theme/Home.vue': path.resolve(__dirname, './components/TentacleHome.vue'),
  }
}