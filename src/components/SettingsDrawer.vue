<template>
  <div>
    <settings ref="settings"></settings>
    <login ref="login"></login>

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
            v-if="$store.getters['users/isLoggedIn']"
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
            v-if="$store.getters['users/isLoggedIn']"
            clickable
            v-ripple
            @click="scanLibrary"
          >
            <q-item-section avatar>
              <q-icon color="primary" name="refresh" />
            </q-item-section>

            <q-item-section>Scan Library</q-item-section>
          </q-item>

          <q-item
            v-if="!$store.getters['users/isLoggedIn']"
            clickable
            v-ripple
            @click="$refs.login.open()"
          >
            <q-item-section avatar>
              <q-icon color="primary" name="person_outline" />
            </q-item-section>

            <q-item-section>Log In</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script>
import Settings from './dlg/Settings'
import Login from './dlg/Login'

export default {
  components: {
    Settings,
    Login
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
