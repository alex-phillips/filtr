<template>
 <q-dialog ref="dialog" @before-show="reset()">
    <q-card style="width: 500px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Edit</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-input v-if="media.length === 1" v-model="name" label="Name">
        </q-input>

        <q-input
          v-if="media.length === 1"
          v-model="description"
          label="Description"
          autogrow
          type="textarea"
        />

        <q-select
          ref="tagSelect"
          label="Mode: 'add-unique'"
          v-model="selectedTags"
          use-input
          use-chips
          multiple
          input-debounce="0"
          new-value-mode="add-unique"
          @new-value="newTag"
          :options="filteredOptions"
          @filter="filterFn"
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
    media: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      // Media properties
      name: '',
      description: '',

      // Options for tag selection
      options: [],
      filteredOptions: [],
      selectedTags: []
    }
  },
  methods: {
    open () {
      this.$refs.dialog.show()
    },

    close (updatedMedia) {
      this.reset()
      this.$refs.dialog.hide()
      this.$emit('close', updatedMedia)
    },

    reset () {
      this.name = ''
      this.description = ''

      this.options = this.$store.getters['tags/getTags'].map(t => {
        return {
          label: t.name,
          value: t.id
        }
      })

      this.selectedTags = []

      if (this.media.length === 1) {
        let existing = this.$store.getters['tags/getTagsByIDs'](this.media[0].tags.map(t => t.id))
        for (let t of existing) {
          this.selectedTags.push({
            label: t.name,
            value: t.id
          })
        }
      }
    },

    async newTag (value, done) {
      // First check if someone pressed 'enter' and didn't select an already existing
      // tag, but it was already in the list.
      let existing = this.options.filter(t => t.label === value)
      if (existing.length === 1) {
        return done(existing[0])
      }

      let response = await this.$axios.post(`${this.$config.server.base_url}/tags/`, {
        name: value
      })

      let newTag = {
        label: response.data.name,
        value: response.data.id
      }
      this.options.push(newTag)

      this.$store.dispatch('tags/getTags')

      done(newTag)
    },

    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.filteredOptions = this.options
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.filteredOptions = this.options.filter(v => {
          return v.label.toLowerCase().indexOf(needle) > -1
        })
        if (this.filteredOptions.length === 0) {

        }
      })
    },

    async submit () {
      let tags = []
      for (let tag of this.selectedTags) {
        tags.push(tag.value)
      }

      let ids = this.media.map(m => m.id)

      let params = {
        tags: tags
      }

      // Only update name and description if editing a single media item
      if (ids.length === 1) {
        params.name = this.name
        params.description = this.description
      }

      let response = await this.$axios.put(`${this.$config.server.base_url}/media/${ids.join(',')}/`, params)

      this.$q.notify({
        message: 'Successfully updated!',
        position: 'bottom-right'
      })

      this.close(response.data)
    }
  }
}
</script>
