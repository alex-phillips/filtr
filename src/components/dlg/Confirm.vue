<template>
  <q-dialog ref="dialog">
    <q-card>
      <q-card-section class="row">
        <span class="q-ml-sm">{{ message }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup/>
        <q-btn flat label="OK" color="primary" @click="confirm()"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'Are you sure?'
    }
  },

  methods: {
    confirm () {
      this.$emit('confirm')
      this.$refs.dialog.hide()
    },

    open () {
      this.$refs.dialog.show()
    }
  }
}
</script>
