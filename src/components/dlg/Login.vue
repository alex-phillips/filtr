<template>
 <q-dialog ref="dialog" @before-show="reset">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form
          @submit="submit"
          @reset="reset"
          class="q-gutter-md"
        >
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

          <div>
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },

  computed: {
    albumTree () {
      return this.$store.getters['albums/tree']
    }
  },

  methods: {
    open () {
      this.$refs.dialog.show()
    },

    close (album) {
      this.reset()
      this.$emit('close', this.album)
      this.$refs.dialog.hide()
    },

    reset () {
      this.email = ''
      this.password = ''
    },

    async submit () {
      let response = await this.$axios.post(`${this.$config.server.base_url}/login`, {
        email: this.email,
        password: this.password
      })

      if (!response.data.id) {
        return this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: 'Invalid email or password'
        })
      }

      this.$store.commit('users/setUser', response.data)

      this.$emit('loggedIn', response.data)
    }
  }
}
</script>
