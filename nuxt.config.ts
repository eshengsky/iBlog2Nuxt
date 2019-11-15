import { Configuration } from "@nuxt/types";

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
  serverMiddleware: ["~/server/index"],
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#f80" },
  /*
   ** Global CSS
   */
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "ant-design-vue/dist/antd.css",
    "~/static/main.css"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "@/plugins/ant-design",
    "@/plugins/font-awesome",
    { src: "@/plugins/tui-editor", mode: "client" }
  ],
  buildModules: ["@nuxt/typescript-build"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios"
    // '@nuxtjs/pwa',
  ],
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
    extend(config, ctx) {}
  },
  watch: ["~/server"]
};

export default config;
