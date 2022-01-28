export default {
  mode: "universal",

  // loading: '~/components/pageLoading.vue',

  /*
   ** Headers of the page
   */
  head: {
    title: "Nuxt project",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css' }
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  // loading: {
  //   name: 'chasing-dots',
  //   color: '#ff5638',
  //   background: 'white',
  //   height: '4px'
  // },
  /*
   ** Global CSS
   */
  css: [
    "@/node_modules/bootstrap/dist/css/bootstrap.min.css",
    "@/node_modules/element-ui/lib/theme-chalk/index.css",
    "quill/dist/quill.snow.css",
    "quill/dist/quill.bubble.css",
    "quill/dist/quill.core.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
    "bootstrap/dist/css/bootstrap.css",
    "bootstrap-vue/dist/bootstrap-vue.css",
    "placeholder-loading/dist/css/placeholder-loading.min.css",
    "index.scss",
      '@/libs/mdbootstrap/lib/scss/mdb-pro.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/eventBus",
    { src: "@/plugins/toast", ssr: false },
    "@/plugins/axios.js",
    "@/plugins/element-ui",
    "@/plugins/fontawesome.js",
    { src: "~plugins/nuxt-quill-plugin.js", ssr: false },
    "@/plugins/bootstrap",
    "@/plugins/loadTextFile",
    "@/plugins/mdbootstrap.js",
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
      "@nuxtjs/axios/",
      "@nuxtjs/auth/",
      "cookie-universal-nuxt",
      "nuxt-vue-material",
      'nuxt-fontawesome'
  ],
  vueMaterial: {
        theme: 'default-dark'
  },


  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },

  axios: {
    // baseURL: 'https://server-now.moiplansh028.now.sh/'
    baseURL: "http://localhost:4000",
  },

  auth: {
    cookie: {
      options: {
        expires: 7,
      },
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/api/auth/login",
            method: "post",
            propertyName: "authToken",
          },
          logout: false,
          user: {
            url: "/api/auth/getUser",
            method: "post",
            propertyName: "user",
          },
        },
        tokenRequired: true,
        globalToken: true,
        tokenType: "",
        autoFetchUser: true,
      },
    },
  },
  /*
   ** Build ui
   */

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    analyze: true,
    transpile: ["lodash-es"],
    extend(config, ctx) {},
  },
}
