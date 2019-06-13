<template>
  <div>
    <q-list>
      <q-item
        v-if="$store.getters['users/isLoggedIn']"
        clickable
        v-ripple
        v-close-popup
        @click="itemSelected('settings')"
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
        v-close-popup
        @click="itemSelected('scan')"
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
        v-close-popup
        @click="itemSelected('login')"
      >
        <q-item-section avatar>
          <q-icon color="primary" name="person_outline" />
        </q-item-section>

        <q-item-section>Log In</q-item-section>
      </q-item>

      <q-item
        v-if="$store.getters['users/isLoggedIn']"
        clickable
        v-ripple
        v-close-popup
        @click="itemSelected('logout')"
      >
        <q-item-section avatar>
          <q-icon color="primary" name="person_outline" />
        </q-item-section>

        <q-item-section>Log Out</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
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
    },

    logout () {
      this.$store.commit('users/logout')
      this.$router.push('/')
    },

    itemSelected (item) {
      this.$emit('item-selected', item)

      switch (item) {
        case 'scan':
          this.scanLibrary()
          break
        case 'logout':
          this.logout()
          break
      }
    }
  }
}
</script>
