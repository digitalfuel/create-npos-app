<% if (esm) { -%>
<% if (ui === 'vuetify') { -%>
import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
<% } -%>
import pkg from './package'
<% } else if (server === 'adonis') { -%>
const { resolve } = require('path')
const pkg = require('../package')
<%} else { -%>
  const pkg = require('./package')
  const merge = require('webpack-merge')
  const moduleConfig = require('../../marketplace_builder/nuxt/nuxt.config.js')
  require('dotenv').config()
  <% } -%>
<% if (!esm) { -%>
<% if (ui === 'vuetify') { %>const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')<% } %>
<% } -%>

<% if (esm) { -%>
export default {
<% } else { -%>
module.exports = () => merge({ 
<% } -%>
  mode: '<%= mode %>',
<% if (server === 'adonis') { %>
  dev: process.env.NODE_ENV === 'development',
  srcDir: resolve(__dirname, '..', 'resources'),
<% } %>

  /*
  ** Revised directories
  */
  dir: {
    middleware: '../../nuxt/' + pkg.name + '/middleware'
  },

  srcDir: '../../marketplace_builder/nuxt/',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [],
    link: []
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [<% if (ui === 'element-ui') { %>
    'element-ui/lib/theme-chalk/index.css'<% } else if (ui === 'tailwind') { %>
    '~/assets/css/tailwind.css'<% } else if (ui === 'vuetify') { %>
    '~/assets/style/app.styl'<% } else if (ui === 'iview') { %>
    'iview/dist/styles/iview.css'<% } else if (ui === 'ant-design-vue') { %>
    'ant-design-vue/dist/antd.css'<% } else if (ui === 'tachyons') { %>
    'tachyons/css/tachyons.css'<% } %>
  ],

  /*
  ** Router property options
  */
  router: {

  /*
  ** Middleware to run on every route
  */
    middleware: ['pOS-globals'] // ,'pOS-pages' 'pOS-authenticity_token',
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [<% if (ui === 'element-ui') { %>
    '@/plugins/element-ui'<% } else if (ui === 'vuetify') { %>
    '@/plugins/vuetify'<% } else if (ui === 'iview') { %>
    '@/plugins/iview'<% } else if (ui === 'ant-design-vue') { %>
    '@/plugins/antd-ui'<% } %>
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [<% if (axios === 'yes') { %>
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'nuxt-vuex-router-sync',<% } %><% if (ui === 'bootstrap') { %>
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',<% } %><% if (ui === 'bulma') { %>
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',<% } %><% if (ui === 'buefy') { %>
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',<% } %><% if (pwa === 'yes') { %>
    '@nuxtjs/pwa',<% } %>
  ],<% if (axios === 'yes') { %>
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://axios.nuxtjs.org/options
    baseURL: (process.env.POS_ENV !== 'production') ? process.env.STAGING_URL + process.env.API_PREFIX : process.env.PRODUCTION_URL + process.env.API_PREFIX,
    proxy: (process.env.NODE_ENV !== 'production') ? true : false
  },
  proxy: [
    process.env.STAGING_URL + process.env.API_PREFIX
  ],<% } %>

  /*
  ** Generated files directory
  */
  generate: {
    dir: '../../marketplace_builder/assets/_nuxt'
  },
  
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    publicPath: (process.env.POS_ENV !== 'production') ? process.env.STAGING_CDN + '/_nuxt/' : process.env.PRODUCTION_CDN + '/_nuxt/',
    <% if (ui === 'bulma') { %>
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },<% } %><% if (ui === 'vuetify') { %>
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },<% } %><% if (ui === 'element-ui') { %>
    transpile: [/^element-ui/],
    <% } %>
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      /*
      ** Add support for pOS block
      */
      config.module.rules.push({
        resourceQuery: /blockType=pos/,
        loader: require.resolve("./pOS/pos-loader.js")
      })<% if (eslint === 'yes') { %>
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }<% } %>
    },
    /*
    ** Change build directory of files
    */
    filenames: {
      app: ({ isDev }) => isDev ? '[path][name].js' : 'scripts/[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[path][name].js' : 'scripts/[chunkhash].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'styles/[contenthash].css',
      img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'images/[hash:7].[ext]',
      font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[hash:7].[ext]',
      video: ({ isDev }) => isDev ? '[path][name].[ext]' : 'videos/[hash:7].[ext]'
    }
  },
  hooks: {

    /*
    ** Add generate script to compile for Platform OS
    */
    'generate:page': (page) => {
      const pOSLoader = require('./pOS/pos-generate.js') 
      pOSLoader(page)
    }
  },

  /*
    ** Turn on Dev tools
  */
  vue: {
    config: {
     devtools: false
    }
  }
}, moduleConfig(pkg) )
