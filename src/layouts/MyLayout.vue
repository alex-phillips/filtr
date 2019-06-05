<template>
  <q-layout view="hHh LpR lFf">
    <global-toolbar @toggle-drawer="$refs.settingsDrawer.toggle()"></global-toolbar>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script>
import GlobalToolbar from '../components/GlobalToolbar'

export default {
  name: 'MyLayout',

  components: {
    GlobalToolbar
  }
}
</script>

<style>
</style>
