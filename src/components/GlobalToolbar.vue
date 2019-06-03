<template>
  <div>
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

        <q-input v-if="$q.screen.gt.xs" dark borderless v-model="searchText" input-class="text-right" @keyup.enter="$router.push(`/search?query=${searchText}`)">
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''" />
          </template>
        </q-input>
        <q-btn flat round dense icon="menu" clickable @click="$emit('toggle-drawer')"></q-btn>
      </q-toolbar>
    </q-header>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchText: ''
    }
  },

  methods: {
    scanLibrary () {
      this.$socket.emit('scan')
    }
  }
}
</script>
