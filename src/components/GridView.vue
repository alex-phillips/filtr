<template>
  <div style="padding-top: 50px;">
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

      <div class="media" v-if="media.length > 0">
        <q-item-label header>Media</q-item-label>
        <div class="q-pa-md q-gutter-sm justify-start row">
          <q-img
            v-for="(image, index) in media"
            v-bind:key="image.id"
            :class="{ selected: image.selected }"
            @click="selectMedia(index, $event)"
            class="image-preview"
            v-lazy:background="`${$config.server.base_url}/media/${image.id}/thumbnail/`"
            spinner-color="primary"
            :style="{ width: `${image.width * 140 / image.height}px` }"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </div>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script>
export default {
  name: 'PageIndex',

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
      selectedAlbums: new Set()
    }
  },

  methods: {
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
.album-preview {
  border: 1px solid black;
  width: 140px;
  height: 140px;
  background-size: cover !important;
  background-position: 50% 50% !important;
}

.image-preview {
  border: 1px solid black;
  height: 140px;
  background-size: cover !important;
  background-position: 50% 50% !important;
}

.selected {
  border: red 5px solid
}
</style>
