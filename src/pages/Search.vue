<template>
  <q-page>
    <album-selector ref="albumSelector" @selected="addToAlbum"></album-selector>
    <media-editor ref="mediaEditor" :media="selectedMedia"></media-editor>

    <grid-view
      ref="gridView"
      :media="media"
      :albums="albums"
      @selected="selected"
    ></grid-view>

    <q-page-sticky expand position="top">
      <q-toolbar class="bg-grey-3">
        <top-level-nav></top-level-nav>

        <sort-nav @sort="sort"></sort-nav>

        <q-item-label>Search Results: {{ $route.query.query }}</q-item-label>

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
import SortNav from '../components/SortNav'

import GridViewWatcher from '../mixins/GridViewWatcher'

export default {
  name: 'AlbumIndex',

  components: {
    GridView,
    AlbumSelector,
    MediaEditor,
    TopLevelNav,
    SortNav
  },

  mixins: [
    GridViewWatcher
  ],

  data () {
    return {
      albums: [],
      media: []
    }
  },

  async beforeMount () {
    this.getData()
  },

  methods: {
    sort (config) {
      this.media = []
      this.getData()
    },

    async getData () {
      let query = {
        offset: this.media.length,
        sortMode: this.$store.getters['media/sortMode'],
        order: this.$store.getters['media/sortOrder'],
        query: this.$route.query.query
      }
      query = Object.keys(query).map((key, i) => `${key}=${query[key]}`).join('&')

      let response = await this.$axios.get(`${this.$config.server.base_url}/search?${query}`)

      this.media = response.data.media
      this.albums = response.data.albums
    }
  }
}
</script>
