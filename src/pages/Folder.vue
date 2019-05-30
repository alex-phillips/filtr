<template>
  <q-page>
    <album-selector ref="albumSelector" @selected="addToAlbum"></album-selector>
    <media-editor ref="mediaEditor" :media="selectedMedia"></media-editor>

    <q-toolbar class="bg-grey-3">
      <q-btn flat @click="$emit('toggle-drawer')" round dense icon="menu" />

      <top-level-nav></top-level-nav>

      <q-breadcrumbs>
        <q-breadcrumbs-el
          v-for="item in lineage"
          :key="item.id"
          :label="item.name"
          :to="item.url"
        />
      </q-breadcrumbs>

      <q-btn flat v-if="selectMode" @click="$refs.gridView.reset()">
        <q-icon name="close"></q-icon>DESELECT ALL
      </q-btn>

      <q-toolbar-title></q-toolbar-title>

      <q-btn flat round dense icon="more_vert" v-if="selectMode">
        <q-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup>
              <q-item-section @click="$refs.mediaEditor.open()">Edit</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="$refs.albumSelector.open()">Add to album...</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <grid-view
      ref="gridView"
      :media="media"
      @loadMore="getData"
      @selected="selected"
    ></grid-view>
  </q-page>
</template>

<style>
</style>

<script>
import GridView from '../components/GridView'
import AlbumSelector from '../components/dlg/AlbumSelector'
import MediaEditor from '../components/dlg/MediaEditor'
import TopLevelNav from '../components/TopLevelNav'

export default {
  name: 'PageIndex',

  components: {
    GridView,
    AlbumSelector,
    MediaEditor,
    TopLevelNav
  },

  data () {
    return {
      media: [],
      selectedMedia: [],
      selectMode: false
    }
  },

  computed: {
    lineage () {
      return this.$store.getters['folders/getFolderLineage'](this.$route.params.id)
    }
  },

  beforeMount () {
    this.reset()
  },

  methods: {
    reset () {
      this.media = []
      this.albums = []
    },

    async getData (index, done) {
      let response = await this.$axios.get(`${this.$config.server.base_url}/folders/${this.$route.params.id}/media/?offset=${this.media.length}`)
      this.media = this.media.concat(response.data)

      if (response.data.length === 0) {
        return
      }

      if (done) {
        done()
      }
    },

    selected (selectedMedia) {
      this.selectedMedia = [...selectedMedia]
      this.selectMode = selectedMedia.size !== 0
    },

    async addToAlbum (album) {
      let ids = [...this.selectedMedia].map(m => m.id)
      this.$store.dispatch('albums/addToAlbum', {
        album: album,
        ids: ids
      })
    }
  }
}
</script>
