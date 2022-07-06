export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  env: {
    TENTACLE_SERVER_HOST: process.env.TENTACLE_SERVER_HOST,
    TENTACLE_SERVER_PROTOCOL: process.env.TENTACLE_SERVER_PROTOCOL,
    TENTACLE_SERVER_PORT: process.env.TENTACLE_SERVER_PORT,
    TENTACLE_SERVER_URL: process.env.TENTACLE_SERVER_URL,
    TENTACLE_CLIENT_HOST: process.env.TENTACLE_CLIENT_HOST,
    TENTACLE_CLIENT_PROTOCOL: process.env.TENTACLE_CLIENT_PROTOCOL,
    TENTACLE_CLIENT_PORT: process.env.TENTACLE_CLIENT_PORT,
    TENTACLE_CLIENT_URL: process.env.TENTACLE_CLIENT_URL,
    TENTACLE_CODESERVER_HOST: process.env.TENTACLE_CODESERVER_HOST,
    TENTACLE_CODESERVER_PROTOCOL: process.env.TENTACLE_CODESERVER_PROTOCOL,
    TENTACLE_CODESERVER_HOST: process.env.TENTACLE_CODESERVER_PORT,
    TENTACLE_CODESERVER_HOST: process.env.TENTACLE_CODESERVER_URL
  },
  head: {
    title: 'tentacle-plc-ui',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/prism'}
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxt/postcss8',
    '@nuxtjs/google-fonts'
  ],

  googleFonts: {
    download: true,
    overwrite: false,
    Roboto: true,
    'Roboto Mono': true
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  }
}
