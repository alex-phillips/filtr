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
      tab: 'settings'
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
    }
  }
}
</script>
