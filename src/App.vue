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
      let user = this.$q.localStorage.getItem('user')
      if (user && user.token) {
        this.$store.commit('users/setUser', user)
        try {
          await this.$axios.get(`${this.$config.server.base_url}/ping`)
        } catch (e) {
          this.$store.commit('users/logout')
        }
      }

      this.$store.dispatch('tags/getTags')
      this.$store.dispatch('albums/fetchAlbums')
      this.$store.dispatch('folders/fetchFolders')
      this.$store.dispatch('config/fetchConfig')
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
