<template>
  <div class="row justify-center">
    <div class="col-md-8 col-xs-11">
      <h4>Settings</h4>
      <h5 class="text-grey-6">Media Paths</h5>
      <q-form
        @submit="submit"
       class="q-gutter-md"
      >
        <q-input
          v-model="path"
          type="textarea"
        />
        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      path: ''
    }
  },

  created () {
    for (let config of this.$store.getters['config/getConfig']) {
      this[config.name] = config.value
    }
  },

  methods: {
    async submit () {
      await this.$axios.put(`${this.$config.server.base_url}/config`, {
        path: this.path
      })

      this.$q.notify({
        message: 'Saved successfully!',
        position: 'bottom-right'
      })

      this.$store.dispatch('config/fetchConfig')
    }
  }
}
</script>

<style scoped>
div.row {
  /* padding-top: 20px */
}
</style>
