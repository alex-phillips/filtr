<template>
<div class="q-pa-md row justify-center">
  <div class="col-lg-6">
    <q-stepper
      v-model="step"
      ref="stepper"
      vertical
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Library Setup"
        icon="photo_library"
        :done="step > 1"
      >
        Tell me where I can find your photos!
        <q-input dense v-model="path" label="Path"></q-input>
      </q-step>

      <q-step
        :name="2"
        title="Finish"
        icon="done_all"
      >
        Let's get started!
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="nextStep" color="primary" :label="step === 2 ? 'Finish' : 'Continue'" />
          <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      path: '',
      step: 1
    }
  },

  methods: {
    nextStep () {
      if (this.step === 2) {
        return this.submit()
      }

      this.$refs.stepper.next()
    },

    async submit () {
      await this.$axios.post(`${this.$config.server.base_url}/config`, {
        path: this.path
      })

      this.$router.replace('/')
    }
  }
}
</script>
