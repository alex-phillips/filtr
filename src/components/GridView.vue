<template>
  <div class="grid-container" ref="gridContainer">
    <q-infinite-scroll @load="loadMore">
      <div class="albums" v-if="albums.length > 0">
        <q-item-label header>Albums</q-item-label>
        <div class="q-pa-md q-gutter-sm">
          <q-img
            v-for="(album, index) in albums"
            v-bind:key="album.id"
            :class="{ selected: album.selected }"
            @click="selectAlbum(index, $event)"
            class="album-preview"
            v-lazy:background="`${$config.server.base_url}/media/${album.previewId}/thumbnail`"
            spinner-color="primary"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center text-white">
                No image available
              </div>
            </template>
          </q-img>
        </div>
      </div>

      <div class="media" v-if="layoutBoxes.length > 0">
        <q-item-label header v-if="albums.length > 0">Media</q-item-label>
        <div class="justified-layout-container">
          <q-img
            v-for="(box, index) in layoutBoxes"
            v-bind:key="media[index].id"
            :class="{ selected: media[index].selected }"
            @click="selectMedia(index, $event)"
            class="image-preview"
            v-lazy:background="`${$config.server.base_url}/media/${media[index].id}/thumbnail/`"
            spinner-color="primary"
            :style="{
              width: `${layoutBoxes[index].width}px`,
              height: `${layoutBoxes[index].height}px`,
              top: `${layoutBoxes[index].top}px`,
              left: `${layoutBoxes[index].left}px`,
            }"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </div>
      </div>

      <div v-if="layoutBoxes.length === 0 && albums.length === 0" class="absolute-full flex flex-center">
        No media
      </div>
    </q-infinite-scroll>
    <resize-observer @notify="getContainerWidth"></resize-observer>
  </div>
</template>

<script>
import JustifiedLayout from 'justified-layout'
import { ResizeObserver } from 'vue-resize'

export default {
  name: 'PageIndex',

  components: {
    ResizeObserver
  },

  created () {
    this.reset()
  },

  props: {
    currentView: {
      type: String,
      default: 'Albums'
    },
    album: {
      type: Object,
      default: () => {}
    },
    albums: {
      type: Array,
      default: () => []
    },
    media: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      selectedMediaIndex: null,
      selectedAlbumIndex: null,
      selectMode: false,
      selectedMedia: new Set(),
      selectedAlbums: new Set(),
      containerWidth: 0
    }
  },

  mounted () {
    this.getContainerWidth()
  },

  computed: {
    layoutBoxes () {
      let config = JustifiedLayout(this.media, {
        containerWidth: this.containerWidth,
        containerPadding: 10
      })
      return config.boxes
    }
  },

  methods: {
    getContainerWidth () {
      this.containerWidth = this.$refs.gridContainer.clientWidth
    },

    reset () {
      for (let asset of this.media) {
        asset.selected = false
      }

      this.selectMode = false
      this.selectedMedia.clear()
      this.$emit('selected', this.selectedMedia)
    },

    loadMore (index, done) {
      setTimeout(() => {
        this.$emit('loadMore', index, done)
      })
    },

    selectMedia (index, event) {
      let media = this.media[index]
      if (!(event.ctrlKey || event.shiftKey || event.metaKey) && !this.selectMode) {
        this.$store.commit('media/setIndex', index)
        this.$store.commit('media/setMedia', this.media)
        return this.$router.push(`/media/${media.id}`)
      }

      let selection = []
      if (event.shiftKey && this.selectedMediaIndex !== null) {
        let min = Math.min(...[this.selectedMediaIndex, index])
        let max = Math.max(...[this.selectedMediaIndex, index])

        if (this.selectedMediaIndex < index) {
          selection = this.media.slice(min + 1, max + 1)
        } else {
          selection = this.media.slice(min, max)
        }
      } else {
        selection = [media]
        this.selectedMediaIndex = index
      }

      selection.map(target => {
        this.$set(target, 'selected', !target.selected)
        if (target.selected) {
          this.selectedMedia.add(target)
        } else {
          this.selectedMedia.delete(target)
        }
      })

      this.selectMode = this.selectedMedia.size !== 0 || this.selectedAlbums.size !== 0

      this.$emit('selected', this.selectedMedia)
    },

    selectAlbum (index, event) {
      let album = this.albums[index]
      // if (!event.ctrlKey && !this.selectMode) {
      return this.$router.push(`/albums/${album.id}`)
      // }

      // const target = this.media.find(a => a.id === album.id)
      // this.$set(target, 'selected', !target.selected)

      // if (target.selected === true) {
      //   this.selectedMedia.add(album)
      //   this.selectedAlbumIndex = index
      // } else {
      //   this.selectedMedia.delete(album)
      // }

      // this.selectMode = this.selectedMedia.size !== 0 || this.selectedAlbums.size !== 0
    },

    async deleteAlbum () {
      await this.$axios.delete(`${this.$config.server.base_url}/albums/${this.album.id}`)
      this.$router.go(-1)
    },

    doneEditing (updated) {

    }
  }
}
</script>

<style>
.grid-container {
  position: relative;
  padding-top: 50px;
  width: 100%;
}

.justified-layout-container {
  position: relative;
  width: 100%;
}

.album-preview {
  border: 1px solid black;
  width: 140px;
  height: 140px;
  background-size: cover !important;
  background-position: 50% 50% !important;
}

.image-preview {
  position: absolute;
  border: 1px solid black;
  background-size: cover !important;
  background-position: 50% 50% !important;
}

.selected {
  border: red 5px solid
}
</style>
