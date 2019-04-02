module.exports = pkg => ({
  /*
  ** WARNING: The following are used by the nuxt platformOS intergration and if altered would best be done in the root nuxt/nuxt.config.js file for this project. 
     Change with CAUTION!!!
  // mode:, 'universal', dir: {}, srcDir: {}, generate: {}, axios:, proxy:, filenames:,
  */

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: "csrf-param", content: "authenticity_token" },
      { name: "csrf-token", content: "{{ context.authenticity_token }}" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: "{{ 'favicon.ico' | asset_url }}" }
    ]
  },

  env: {},

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [],

  /*
  ** Router property options
  */
  router: {},

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {}
  },
  hooks: {},
  vue: {
    config: {
    //  devtools: true
    }
  }
})