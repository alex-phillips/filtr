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
        <search></search>
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
import Search from './Search'
import Settings from './dlg/Settings'

export default {
  components: {
    Search,
    Settings
  },

  data () {
    return {
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
