<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

  created () {
    this.$store.dispatch('tags/getTags')
    this.$store.dispatch('albums/fetchAlbums')
  },

  ready () {
    window.addEventListener('keyup', (event) => {
      if (event.keyCode === 27) {
        this.$broadcast('escape-pressed')
      }
    })
  }
}
</script>

<style>
</style>
