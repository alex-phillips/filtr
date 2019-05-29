<template>
 <q-dialog ref="dialog" @before-show="reset()">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div v-if="!album.name" class="text-h6">Create New Album</div>
        <div v-else class="text-h6">Edit Album</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-input v-model="name" label="Name"></q-input>

        <q-input
          v-model="description"
          label="Description"
          autogrow
          type="textarea"
        />

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
        <q-btn flat label="Cancel" color="primary" @click="close()" />
        <q-btn flat label="Save" color="primary" @click="submit()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    album: {
      type: Object,
      default: () => {
        return {
          name: '',
          description: ''
        }
      }
    }
  },

  data () {
    return {
      name: '',
      description: '',
      treeFilter: '',
      selectedParentId: null
    }
  },

  computed: {
    albumTree () {
      return this.$store.getters['entities/albumTree']
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
      this.name = ''
      this.description = ''
    },

    async submit () {
      if (this.album.id) {
        let response = await this.$axios.put(`${this.$config.server.base_url}/albums/${this.ablum.id}/`, {
          ...this.album,
          name: this.name,
          description: this.description,
          parentId: this.selectedParentId
        })

        this.$q.notify({
          message: 'Successfully updated!',
          position: 'bottom-right'
        })
        this.response = response.results
        this.close()
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

      this.$store.dispatch('entities/fetchAlbums')
    }
  }
}
</script>
