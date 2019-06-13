<template>
  <div class="row justify-center">
    <div class="col-md-8 col-xs-11">
      <h4>Account</h4>
      <h5 class="text-grey-6">Change Password</h5>
       <q-form
         @submit="submit"
         class="q-gutter-md"
       >
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
      currentPassword: '',
      password1: '',
      password2: ''
    }
  },

  created () {
    for (let config of this.$store.getters['config/getConfig']) {
      this.config[config.name] = config.value
    }
  },

  methods: {
    async submit () {
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

<style scoped>
div.row {
  /* padding-top: 20px */
}
</style>
