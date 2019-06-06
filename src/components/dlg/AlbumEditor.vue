<template>
 <q-dialog ref="dialog" @before-show="reset">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div v-if="!album.id" class="text-h6">Create New Album</div>
        <div v-else class="text-h6">Edit Album</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form
          class="q-gutter-md"
        >

          <q-input v-model="name" label="Name" @keyup.enter="submit()"></q-input>

          <q-input
            v-model="description"
            label="Description"
            autogrow
            type="textarea"
          />

          <div class="q-gutter-sm">
            <q-checkbox left-label v-model="isPublic" label="Public" />
          </div>

        </q-form>
      </q-card-section>

      <q-card-section v-if="albumTree.length > 0">
        <div>Parent Album</div>
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
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="close" />
        <q-btn flat label="Save" color="primary" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      album: {},
      name: '',
      description: '',
      treeFilter: '',
      selectedParentId: null,
      isPublic: false
    }
  },

  computed: {
    albumTree () {
      return this.$store.getters['albums/tree']
    }
  },

  methods: {
    open (album) {
      this.album = album || {}
      this.$refs.dialog.show()
    },

    close (album) {
      this.reset()
      this.$emit('close', album)
      this.$refs.dialog.hide()
    },

    reset () {
      this.name = this.album.name || ''
      this.description = this.album.description || ''
      this.isPublic = this.album.public
      this.treeFilter = ''
    },

    async submit () {
      if (this.album.id) {
        let response = await this.$axios.put(`${this.$config.server.base_url}/albums/${this.album.id}/`, {
          name: this.name,
          description: this.description,
          parentId: this.selectedParentId,
          public: this.isPublic === true ? 1 : 0
        })

        this.$q.notify({
          message: 'Successfully updated!',
          position: 'bottom-right'
        })

        this.close(response.data)
      } else {
        let response = await this.$axios.post(`${this.$config.server.base_url}/albums/`, {
          name: this.name,
          description: this.description,
          parentId: this.selectedParentId
        })

        this.$q.notify({
          message: 'Successfully created album!',
          position: 'bottom-right'
        })

        this.close(response.data)
      }

      this.$store.dispatch('albums/fetchAlbums')
    }
  }
}
</script>
