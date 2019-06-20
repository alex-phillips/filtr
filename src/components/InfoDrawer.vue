<template>
  <div>
    <media-editor ref="mediaEditor" @close="doneEditing" :media="[media]"></media-editor>

    <q-drawer
      side="right"
      v-model="drawerOpen"
      bordered
      content-class="bg-grey-3"
    >
      <q-list>
        <q-item-label header>About</q-item-label>
        <q-item>
          <q-item-section>
            <q-item-label>Name</q-item-label>
            <q-item-label caption>{{ media.name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Description</q-item-label>
            <q-item-label caption>{{ media.description }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Path</q-item-label>
            <q-item-label caption>{{ media.path }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Width</q-item-label>
            <q-item-label caption>{{ media.width }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Height</q-item-label>
            <q-item-label caption>{{ media.height }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Location</q-item-label>
            <q-item-label caption><q-icon name="location_on" />{{ media.latitude }}, {{ media.longitude }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="tags.length > 0">
          <q-chip v-for="tag in tags" v-bind:key="tag.id"
            dense
            icon="local_offer"
            clickable
            @click="$router.push(tag.url)"
          >{{ tag.name }}</q-chip>
        </q-item>
        <q-item v-if="$store.getters['users/isLoggedIn']" clickable @click="$refs.mediaEditor.open()">
          <q-item-section avatar>
            <q-icon name="edit" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Edit</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import MediaEditor from './dlg/MediaEditor'

export default {
  components: {
    MediaEditor
  },

  props: {
    media: {
      type: Object,
      default: () => {}
    },
    mediaTags: {
      type: Array,
      default: () => []
    },
    drawerOpen: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      tags: []
    }
  },

  mounted () {
    this.updateTags(this.media.tags.map(t => t.id))
  },

  methods: {
    doneEditing (media) {
      this.$emit('mediaUpdated', media)
      this.updateTags(media.tags.map(t => t.id))
    },

    updateTags (tagIDs) {
      this.tags = this.$store.getters['tags/getTagsByIDs'](tagIDs)
    }
  }
}
</script>
