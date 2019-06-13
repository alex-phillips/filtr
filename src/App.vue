<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',

  async created () {
    let response = await this.$axios.get(`${this.$config.server.base_url}/config`)
    let config = response.data

    if (config.length === 0) {
      this.$router.replace('/install')
    } else {
      this.initialize()
    }
  },

  methods: {
    async initialize () {
      try {
        let response = await this.$axios.get(`${this.$config.server.base_url}/ping`)
        this.$store.commit('users/setUser', response.data)
      } catch (e) {
        this.$store.commit('users/logout')
      }

      this.$store.dispatch('tags/getTags')
      this.$store.dispatch('albums/fetchAlbums')
      this.$store.dispatch('config/fetchConfig')

      if (this.$store.getters['users/isLoggedIn']) {
        this.$store.dispatch('folders/fetchFolders')
      }
    }
  },

  sockets: {
    scan: function (data) {
      this.$q.notify({
        message: data,
        position: 'bottom-right'
      })
    }
  }
}
</script>

<style>
</style>
