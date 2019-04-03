<pos>
---
slug: /
---
{%- assign description = 'Nuxt PlatformOS intergration' -%}

{%- export description namespace: "pages_index" -%}
</pos>

<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        {{ company }}
      </h1>
      <h2 class="subtitle">
        {{ description }}
      </h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green">Documentation</a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey">GitHub</a>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import { mapMutations } from 'vuex'
import { mapState } from 'vuex'
import { mapActions } from 'vuex'

export default {

  components: {
    Logo
  },
  computed: {
    ...mapState('pages_index', {
      description: 'description',
    }),
    ...mapState('globals', {
      company: 'company'
    })
  },
  fetch ({ store, route, $axios }) {

    return $axios.$get( 'pages/' + route.name + '/index.json')
      .then( res => {
      
        store.commit('pages_' + route.name + '/pOS', res )

      })

  }

}
</script>

<style>

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.red {
  color: red
}
</style>
