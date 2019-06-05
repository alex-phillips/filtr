<template>
  <q-dialog ref="dialog">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Settings</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="settings" label="Settings" />
          <q-tab name="account" label="Account" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="settings">
            <q-input
              v-for="(item, index) in config"
              :key="index"
              v-model="config[index].value"
              :label="item.name"
              :type="configTypes[item.name] || 'text'"
            />
          </q-tab-panel>

          <q-tab-panel name="account">
            <q-input
              v-model="currentPassword"
              label="Current Password"
              type="password"
            />
            <q-input
              v-model="password1"
              label="New Password"
              type="password"
            />
            <q-input
              v-model="password2"
              label="Repeat Password"
              type="password"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="close()" />
        <q-btn flat label="Save" color="primary" @click="submit()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      configTypes: {},
      tab: 'settings',
      currentPassword: '',
      password1: '',
      password2: ''
    }
  },

  computed: {
    config () {
      return this.$store.getters['config/getConfig']
    }
  },

  methods: {
    open () {
      this.$refs.dialog.show()
    },

    close (updatedMedia) {
      this.$emit('close', updatedMedia)
      this.$refs.dialog.hide()
    },

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

      this.close()
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

      this.close()
    }
  }
}
</script>
