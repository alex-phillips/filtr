<template>
  <div>
    <login ref="login"></login>

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

        <q-avatar square>
          <img src="~assets/logo.png">
        </q-avatar>

        <q-toolbar-title>
          Filtr
        </q-toolbar-title>

        <q-input v-if="$q.screen.gt.xs" dark borderless v-model="searchText" input-class="text-right" @keyup.enter="$router.push(`/search?query=${searchText}`)">
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''" />
          </template>
        </q-input>

        <q-btn v-if="$q.screen.gt.xs" flat round icon="person" clickable>
          <q-menu ref="settingsMenu">
            <settings-menu @item-selected="menuItemSelected"></settings-menu>
          </q-menu>
        </q-btn>
        <q-btn v-else flat round icon="person" clickable @click="$refs.settingsDrawer.toggle()"></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerIsOpen"
      side="right"
      :breakpoint="700"
      elevated
      ref="settingsDrawer"
    >
      <q-scroll-area class="fit">
        <q-input v-if="$q.screen.lt.sm" filled v-model="searchText" input-class="text-right" @keyup.enter="$router.push(`/search?query=${searchText}`)">
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''" />
          </template>
        </q-input>

        <settings-menu @item-selected="menuItemSelected"></settings-menu>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script>
import SettingsMenu from './SettingsMenu'
import Login from './dlg/Login'

export default {
  components: {
    SettingsMenu,
    Login
  },

  data () {
    return {
      searchText: '',
      drawerIsOpen: false
    }
  },

  methods: {
    scanLibrary () {
      this.$socket.emit('scan')
    },

    openMenu () {
      if (this.$q.screen.gt.xs) {

      } else {
        this.drawerIsOpen = !this.drawerIsOpen
      }
    },

    menuItemSelected (item) {
      switch (item) {
        case 'settings':
          this.$router.push('/settings')
          break
        case 'login':
          this.$refs.login.open()
          break
      }
    }
  }
}
</script>
