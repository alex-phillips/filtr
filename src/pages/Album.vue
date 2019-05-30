<template>
  <q-page>
    <album-editor ref="albumEditor" @close="getAlbumData"></album-editor>
    <album-selector ref="albumSelector" @selected="addToAlbum"></album-selector>
    <media-editor ref="mediaEditor" :media="selectedMedia"></media-editor>
    <confirm ref="confirmRemoveImages" :message="'Remove images from album?'" @confirm="removeFromAlbum"></confirm>
    <confirm ref="confirmDeleteAlbum" :message="'Really delete album?'" @confirm="deleteAlbum"></confirm>

    <q-toolbar class="bg-grey-3">
      <q-breadcrumbs>
        <q-breadcrumbs-el
          icon="home"
          to="/albums"
        />
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

      <q-btn flat round dense @click="$refs.albumEditor.open()">
        <q-icon name="add_to_photos"></q-icon>
      </q-btn>

      <q-btn v-if="album" flat round dense @click="$refs.confirmDeleteAlbum.open()">
        <q-icon name="delete"></q-icon>
      </q-btn>

      <q-btn flat round dense icon="more_vert" v-if="selectMode">
        <q-menu>
          <q-list style="min-width: 150px">
            <q-item clickable v-close-popup>
              <q-item-section @click="$refs.mediaEditor.open()">Edit</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="$refs.albumSelector.open()">Add to album...</q-item-section>
            </q-item>
            <q-item clickable v-close-popup v-if="!!album">
              <q-item-section @click="$refs.confirmRemoveImages.open()">Remove from album</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <grid-view
      v-if="album.id !== undefined"
      ref="gridView"
      :media="media"
      :albums="albums"
      @loadMore="getData"
      @selected="selected"
    ></grid-view>
  </q-page>
</template>

<style>
</style>

<script>
import GridView from '../components/GridView'
import AlbumEditor from '../components/dlg/AlbumEditor'
import AlbumSelector from '../components/dlg/AlbumSelector'
import Confirm from '../components/dlg/Confirm'
import MediaEditor from '../components/dlg/MediaEditor'

export default {
  name: 'AlbumIndex',

  components: {
    GridView,
    AlbumEditor,
    AlbumSelector,
    Confirm,
    MediaEditor
  },

  data () {
    return {
      dataUrl: null,
      album: {},
      albums: [],
      media: [],
      selectedMedia: [],
      selectMode: false,
      lineage: []
    }
  },

  created () {
    this.dataUrl = `${this.$config.server.base_url}/albums/${this.$route.params.id}`
    this.lineage = this.$store.getters['albums/getAlbumLineage'](this.$route.params.id).reverse()
  },

  async beforeMount () {
    this.getAlbumData()
  },

  methods: {
    reset () {
      this.media = []
    },

    async getAlbumData () {
      let response = await this.$axios.get(`${this.dataUrl}`)
      this.album = response.data
      this.albums = this.album.children
    },

    async getData (index, done) {
      if (!this.album.id) {
        let response = await this.$axios.get(`${this.dataUrl}`)
        this.album = response.data
      }

      let response = await this.$axios.get(`${this.dataUrl}/media/?offset=${this.media.length}`)
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
    },

    async deleteAlbum () {
      await this.$axios.delete(this.dataUrl)
      this.$store.commit('albums/deleteAlbum', this.album)
      this.$store.dispatch('albums/fetchAlbums')
      this.$router.go(-1)
    },

    async removeFromAlbum () {
      let selectedIds = new Set([...this.selectedMedia].map(m => m.id))
      let ids = []
      this.media.filter(img => {
        if (!selectedIds.has(img.id)) {
          ids.push(img.id)
        }
      })

      await this.$axios.delete(`${this.$config.server.base_url}/albums/${this.album.id}/media/${ids.join(',')}`)

      this.$emit('updatedAlbum')
    }
  }
}
</script>
