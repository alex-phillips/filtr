<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Filtr
        </q-toolbar-title>

        <search></search>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :key="$route.path" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import Search from '../components/Search'

export default {
  name: 'MyLayout',

  components: {
    Search
  },

  methods: {
    openURL
  }
}
</script>

<style>
</style>
