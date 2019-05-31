<template>
  <div id="q-app">
    <router-view :key="$route.path"/>
  </div>
</template>

<script>
export default {
  name: 'App',

  created () {
    this.$store.dispatch('tags/getTags')
    this.$store.dispatch('albums/fetchAlbums')
    this.$store.dispatch('folders/fetchFolders')
  }
}
</script>

<style>
</style>
