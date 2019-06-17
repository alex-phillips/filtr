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
        <top-level-nav v-if="!selectMode"></top-level-nav>

        <sort-nav v-if="!selectMode" @sort="sort"></sort-nav>

        <q-btn flat v-if="selectMode" @click="$refs.gridView.reset()">
          <q-icon name="close"></q-icon>DESELECT ALL
        </q-btn>

        <q-breadcrumbs
          v-if="tag.id !== undefined"
        >
          <q-breadcrumbs-el
            icon="local_offer"
            :label="tag.name"
            to="/albums"
          />
        </q-breadcrumbs>

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
import GridViewState from '../mixins/GridViewState'

export default {
  name: 'PageIndex',

  components: {
    GridView,
    AlbumSelector,
    MediaEditor,
    TopLevelNav,
    SortNav
  },

  mixins: [
    GridViewWatcher,
    GridViewState
  ],

  data () {
    return {
      tag: {}
    }
  },

  created () {
    this.dataUrl = `${this.$config.server.base_url}/tags/${this.$route.params.id}/media/`
    this.tag = this.$store.getters['tags/getTagByID'](parseInt(this.$route.params.id))
  },

  methods: {
    sort (config) {
      this.media = []
      this.getData()
    }
  }
}
</script>
