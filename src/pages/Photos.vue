<template>
  <q-page>
    <album-selector ref="albumSelector" @selected="addToAlbum"></album-selector>
    <media-editor ref="mediaEditor" :media="selectedMedia"></media-editor>

    <q-toolbar class="bg-grey-3">
      <q-btn-dropdown stretch flat label="Media">
        <q-list>
          <q-item clickable v-close-popup>
            <q-item-section>
              <q-item-label>Media</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="$router.push('/albums')">
            <q-item-section>
              <q-item-label>Albums</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

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

export default {
  name: 'PageIndex',

  components: {
    GridView,
    AlbumSelector,
    MediaEditor
  },

  data () {
    return {
      media: [],
      selectedMedia: [],
      selectMode: false
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
      let response = await this.$axios.get(`${this.$config.server.base_url}/media/?offset=${this.media.length}`)
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
      await this.$axios.put(`${this.$config.server.base_url}/albums/${album.id}/media/${ids.join(',')}`)
    }
  }
}
</script>
