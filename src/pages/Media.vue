<template>
  <q-layout view="hHh Lpr lFf" @keyup.escape="$router.push(-1)">
    <album-selector ref="albumSelector" @selected="addToAlbum"></album-selector>

    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="$router.go(-1)"
          aria-label="Menu"
        >
          <q-icon name="arrow_back" />
        </q-btn>

        <q-toolbar-title>
          Filtr
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          aria-label="Add to album"
          @click="$refs.albumSelector.open()"
        >
          <q-icon name="add"></q-icon>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <info-drawer
        v-if="media.id"
        :media="media"
        :drawerOpen="infoDrawerOpen"
        @mediaUpdated="mediaUpdated"
      ></info-drawer>

      <q-page
        v-touch-swipe.mouse.left="goToNext"
        v-touch-swipe.mouse.right="goToPrevious"
      >
          <img class="media" :class="[ isZoomed ? '' : 'media-fit']" :src="src" contain v-if="media.mimetype && media.mimetype.match(/image\//)"/>
          <q-video
            class="media"
            v-else-if="media.mimetype && media.mimetype.match(/video\//)"
            :src="src"
            style="width: 100%; height: 100%;"
          />

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn fab icon="info" color="primary" @click="infoDrawerOpen = !infoDrawerOpen"/>
        </q-page-sticky>

        <q-page-sticky position="bottom-right" :offset="[18, 85]" v-if="media.mimetype && media.mimetype.match(/image\//)">
          <q-btn fab :icon="isZoomed ? 'zoom_out' : 'zoom_in'" color="primary" @click="isZoomed = !isZoomed"/>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import InfoDrawer from '../components/InfoDrawer'
import AlbumSelector from '../components/dlg/AlbumSelector'

export default {
  components: {
    InfoDrawer,
    AlbumSelector
  },

  data () {
    return {
      infoDrawerOpen: false,
      src: null,
      media: {
        type: null
      },
      isZoomed: false
    }
  },

  async beforeCreate () {
    let response = await this.$axios.get(`${this.$config.server.base_url}/media/${this.$route.params.id}`)
    this.media = response.data
    this.src = `${this.$config.server.base_url}/media/${this.$route.params.id}/original`
  },

  mounted () {
    window.addEventListener('keyup', this.onKeypress, false)
  },

  beforeDestroy () {
    window.removeEventListener('keyup', this.onKeypress, false)
  },

  methods: {
    onKeypress (e) {
      switch (e.keyCode) {
        case 39:
          this.goToNext()
          break
        case 37:
          this.goToPrevious()
          break
        case 27:
          this.$router.go(-1)
          break
      }
    },

    goToNext () {
      if (this.isZoomed) {
        return
      }

      let index = this.$store.getters['media/getIndex']

      let media = this.$store.getters['media/getNext']
      index += 1

      console.log(media)

      if (media) {
        this.$store.commit('media/setIndex', index)
        this.$router.replace(media.url)
      }
    },

    goToPrevious () {
      if (this.isZoomed) {
        return
      }

      let index = this.$store.getters['media/getIndex']

      let media = this.$store.getters['media/getPrevious']
      index -= 1

      if (media) {
        this.$store.commit('media/setIndex', index)
        this.$router.replace(media.url)
      }
    },

    async addToAlbum (album) {
      await this.$axios.put(`${this.$config.server.base_url}/media/${this.media.id}/`, {
        albums: this.media.albums.concat([album.id])
      })
    },

    mediaUpdated (media) {
      this.media = media
    }
  }
}
</script>

<style scoped>
.media {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: auto;
}

.media-fit {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
}
</style>
