<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        @click="$router.push('/')"
        aria-label="Home"
      >
        <q-icon name="home" />
      </q-btn>

      <q-btn
        flat
        dense
        round
        @click="$router.go(-1)"
        aria-label="Menu"
      >
        <q-icon name="arrow_back" />
      </q-btn>

      <q-toolbar-title>
        Filtr
      </q-toolbar-title>

      <search></search>
    </q-toolbar>
  </q-header>
</template>

<script>
import Search from '../components/Search'

export default {
  components: {
    Search
  }
}
</script>
