<template>
  <q-layout view="hHh Lpr lFf">
    <global-toolbar></global-toolbar>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import GlobalToolbar from '../components/GlobalToolbar'

export default {
  name: 'MyLayout',

  components: {
    GlobalToolbar
  },

  methods: {
    openURL
  }
}
</script>

<style>
</style>
