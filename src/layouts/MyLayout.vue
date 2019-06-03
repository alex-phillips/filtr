<template>
  <q-layout view="hHh Lpr lFf">
    <global-toolbar @toggle-drawer="$refs.settingsDrawer.toggle()"></global-toolbar>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>

    <settings-drawer ref="settingsDrawer"></settings-drawer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import GlobalToolbar from '../components/GlobalToolbar'
import SettingsDrawer from '../components/SettingsDrawer'

export default {
  name: 'MyLayout',

  components: {
    GlobalToolbar,
    SettingsDrawer
  },

  methods: {
    openURL
  }
}
</script>

<style>
</style>
