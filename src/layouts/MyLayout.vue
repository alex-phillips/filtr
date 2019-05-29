<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          Quasar App
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
