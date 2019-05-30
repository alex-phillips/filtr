<template>
 <q-dialog ref="dialog" @before-show="reset">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Select Album</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-input ref="filter" dense v-model="treeFilter" label="Filter">
          <template v-slot:append>
            <q-icon v-if="treeFilter !== ''" name="clear" class="cursor-pointer" @click="treeFilter = ''" />
          </template>
        </q-input>

        <q-tree
          :nodes="albumTree"
          :filter="treeFilter"
          default-expand-all
          :selected.sync="selectedParentId"
          node-key="id"
          @update:selected="selectAlbum"
        />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <div class="row items-center">
          <div class="col-10">
            <q-input v-model="name" label="Create a new album" @keyup.enter="submit()"></q-input>
          </div>
          <div class="col-2">
            <q-btn flat label="Create" color="primary" @click="submit()" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      treeFilter: '',
      selectedParentId: null
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

    close () {
      this.$refs.dialog.hide()
    },

    reset () {
      this.name = ''
      this.treeFilter = ''
      this.selectedParentId = null
    },

    async submit () {
      let response = await this.$axios.post(`${this.$config.server.base_url}/albums/`, {
        name: this.name
      })
      let newAlbum = response.data
      this.selectAlbum(newAlbum)
    },

    selectAlbum (album) {
      if (typeof album === 'number') {
        album = {
          id: album
        }
      }
      console.log(album)
      this.$emit('selected', album)
      this.close()
    }
  }
}
</script>
