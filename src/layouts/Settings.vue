<template>
  <q-page>
    <q-drawer
      v-model="drawerIsOpen"
      :breakpoint="700"
      elevated
      ref="settingsDrawer"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item
            clickable
            v-ripple
            @click="$router.push('/settings')"
          >
            <q-item-section avatar>
              <q-icon color="primary" name="settings" />
            </q-item-section>

            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push('/settings/account')"
          >
            <q-item-section avatar>
              <q-icon color="primary" name="person" />
            </q-item-section>

            <q-item-section>Account</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-toolbar class="bg-grey-3" v-if="$q.screen.lt.sm">
      <q-btn icon="menu" flat clickable @click="drawerIsOpen = !drawerIsOpen"></q-btn>
    </q-toolbar>

    <div class="settings-pane">
      <router-view :key="$route.path"></router-view>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      drawerIsOpen: true
    }
  },

  computed: {
    config () {
      return this.$store.getters['config/getConfig']
    }
  },

  methods: {
    async submit () {
      switch (this.tab) {
        case 'settings':
          await this.submitSettings()
          break
        case 'account':
          await this.submitAccount()
          break
      }
    },

    async submitSettings () {
      let data = {}
      for (let item of this.config) {
        data[item.name] = item.value
      }

      await this.$axios.put(`${this.$config.server.base_url}/config`, data)

      this.$q.notify({
        message: 'Saved successfully!',
        position: 'bottom-right'
      })

      this.$store.dispatch('config/fetchConfig')
    },

    async submitAccount () {
      if (!this.currentPassword || !this.password1 || !this.password2) {
        return this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: 'Please enter your current password'
        })
      }

      if (this.password1 !== this.password2) {
        return this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: 'Passwords do not match'
        })
      }

      try {
        await this.$axios.put(`${this.$config.server.base_url}/users`, {
          currentPassword: this.currentPassword,
          password: this.password1
        })
      } catch (err) {
        return this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: err.response.data.message
        })
      }

      this.$q.notify({
        message: 'Successfully saved!'
      })
    }
  }
}
</script>

<style>
.settings-pane h5 {
  margin-bottom: 0;
}
</style>
