<template>
  <div>
    <settings ref="settings"></settings>

    <q-drawer
      ref="drawer"
      v-model="isOpen"
      side="right"
      :breakpoint="700"
      elevated
    >
      <q-scroll-area class="fit">
        <q-input v-if="$q.screen.lt.sm" filled v-model="searchText" input-class="text-right" @keyup.enter="$router.push(`/search?query=${searchText}`)">
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''" />
          </template>
        </q-input>

        <q-list>
          <q-item
            clickable
            v-ripple
            @click="$refs.settings.open()"
          >
            <q-item-section avatar>
              <q-icon color="primary" name="settings" />
            </q-item-section>

            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="scanLibrary"
          >
            <q-item-section avatar>
              <q-icon color="primary" name="refresh" />
            </q-item-section>

            <q-item-section>Scan Library</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script>
import Settings from './dlg/Settings'

export default {
  components: {
    Settings
  },

  data () {
    return {
      searchText: '',
      isOpen: false
    }
  },

  methods: {
    scanLibrary () {
      this.$socket.emit('scan')
    },

    toggle () {
      this.$refs.drawer.toggle()
    }
  }
}
</script>
