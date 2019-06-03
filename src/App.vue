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

    // Check if we need to run through the 'install' process
    let pathConfig = config.filter(c => c.name === 'path')
    if (pathConfig.length === 0 || !pathConfig[0].value) {
      this.$router.replace('/install')
    } else {
      this.initialize()
    }
  },

  methods: {
    initialize () {
      this.$store.dispatch('tags/getTags')
      this.$store.dispatch('albums/fetchAlbums')
      this.$store.dispatch('folders/fetchFolders')
      this.$store.dispatch('config/fetchConfig')
    }
  },

  sockets: {
    connect: function () {
      console.log('socket connected')
    },

    scan: function (data) {
      console.log(data)
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
