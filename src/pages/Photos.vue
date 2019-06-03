<template>
  <q-page>
    <album-selector ref="albumSelector" @selected="addToAlbum"></album-selector>
    <media-editor ref="mediaEditor" :media="selectedMedia"></media-editor>

    <grid-view
      ref="gridView"
      :media="media"
      @loadMore="getData"
      @selected="selected"
    ></grid-view>

    <q-page-sticky expand position="top">
      <q-toolbar class="bg-grey-3">
        <top-level-nav></top-level-nav>

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
    </q-page-sticky>
  </q-page>
</template>

<style>
</style>

<script>
import GridView from '../components/GridView'
import AlbumSelector from '../components/dlg/AlbumSelector'
import MediaEditor from '../components/dlg/MediaEditor'
import TopLevelNav from '../components/TopLevelNav'

import GridViewWatcher from '../mixins/GridViewWatcher'

export default {
  name: 'PageIndex',

  components: {
    GridView,
    AlbumSelector,
    MediaEditor,
    TopLevelNav
  },

  mixins: [
    GridViewWatcher
  ],

  data () {
    return {
      media: []
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
    }
  }
}
</script>
