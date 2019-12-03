import { Configuration } from "@nuxt/types";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const config: Configuration = {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  server: {
    port: 8000,
    host: "localhost"
  },
  serverMiddleware: [
    cookieParser(),
    bodyParser.json(),
    "@/server/api/index",
    "@/server/api/admin",
    "@/server/api/auth"
  ],
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#f80" },
  /*
   ** Global CSS
   */
  css: [
    "ant-design-vue/dist/antd.less",
    "@fortawesome/fontawesome-svg-core/styles.css",
    "~/static/main.css"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/axios",
    "@/plugins/ant-design",
    "@/plugins/font-awesome",
    "@/plugins/event-bus",
    { src: "@/plugins/baidu-stats", mode: "client" },
    { src: "@/plugins/tui-editor", mode: "client" }
  ],
  buildModules: ["@nuxt/typescript-build"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth"
    // '@nuxtjs/pwa',
  ],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: "/auth/api/login", method: "post", propertyName: 'token.accessToken' },
          logout: { url: "/auth/api/logout", method: "post" },
          user: { url: "/auth/api/user", method: "get", propertyName: 'user' }
        }
      }
    },
    redirect: {
      login: '/auth/login',
      logout: '/',
      callback: '/auth/login',
      home: '/'
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    loaders: {
      less: {
        modifyVars: {
          'outline-width': 0
        },
        javascriptEnabled: true
      }
    }
  },
  watch: ["~/server"]
};

export default config;
