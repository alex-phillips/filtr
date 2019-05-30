<template>
  <q-page>
    <q-toolbar class="bg-grey-3">
      <q-btn flat v-if="selectMode" @click="$refs.gridView.reset()">
        <q-icon name="close"></q-icon>DESELECT ALL
      </q-btn>

      <q-breadcrumbs
        v-if="tag.id !== undefined"
      >
        <q-breadcrumbs-el
          icon="home"
          to="/"
        />
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
            <q-item clickable v-close-popup v-if="!!album">
              <q-item-section @click="$refs.confirmRemoveImages.open()">Remove from album</q-item-section>
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

export default {
  name: 'PageIndex',

  components: {
    GridView
  },

  data () {
    return {
      tag: {},
      dataUrl: null,
      media: [],
      selectMode: false
    }
  },

  created () {
    this.dataUrl = `${this.$config.server.base_url}/tags/${this.$route.params.id}`
    this.tag = this.$store.getters['tags/getTagByID'](parseInt(this.$route.params.id))
  },

  methods: {
    selected (selectedMedia) {
      this.selectedMedia = [...selectedMedia]
      this.selectMode = selectedMedia.size !== 0
    },

    async getData (index, done) {
      let response = await this.$axios.get(`${this.dataUrl}/media/?offset=${this.media.length}`)
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
