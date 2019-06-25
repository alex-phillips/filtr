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
        title="User Creation"
        icon="person_add"
        :done="step > 1"
      >
        Let's start by creating an admin account!
        <q-form>
          <q-input
            dense
            v-model="email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Email is required!' ]"
          ></q-input>
          <q-input
            dense
            v-model="password"
            label="Password"
            type="password"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Password is required!' ]"
          ></q-input>
        </q-form>
      </q-step>

      <q-step
        :name="2"
        title="Library Setup"
        icon="photo_library"
        :done="step > 2"
      >
        Tell me where I can find your photos!
        <q-input dense v-model="path" label="Path"></q-input>
      </q-step>

      <q-step
        :name="3"
        title="Finish"
        icon="done_all"
      >
        You're ready to go!
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="nextStep" color="primary" :label="step === 3 ? 'Finish' : 'Continue'" />
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
      email: '',
      password: '',
      path: '',
      step: 1
    }
  },

  methods: {
    async nextStep () {
      if (this.step === 3) {
        this.$store.commit('media/scan')
        return this.submit()
      }

      this.$refs.stepper.next()
    },

    async submit () {
      try {
        await this.$axios.post(`${this.$config.server.base_url}/users`, {
          email: this.email,
          password: this.password
        })

        let response = await this.$axios.post(`${this.$config.server.base_url}/login`, {
          email: this.email,
          password: this.password
        })

        this.$store.commit('users/login', response.data)
      } catch (err) {
        return this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: err.response.data.message
        })
      }

      await this.$axios.post(`${this.$config.server.base_url}/config`, {
        path: this.path
      })

      this.$router.replace('/')
    }
  }
}
</script>
