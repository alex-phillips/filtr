<template>
  <div>
    <info-drawer
      v-if="media.id"
      :media="media"
      :drawerOpen="infoDrawerOpen"
      @mediaUpdated="mediaUpdated"
    ></info-drawer>

    <q-page>
      <img class="media" :class="[ isZoomed ? '' : 'media-fit']" :src="src" contain v-if="media.mimetype && media.mimetype.match(/image\//)"/>
      <video-player :options="videoOptions"
        class="media"
        v-if="media.mimetype && media.mimetype.match(/video\//)"
        style="width: 100%; height: 100%;"
      />

      <div
        id="swipe-overlay-handler"
        v-if="!isZoomed"
        v-touch-swipe.mouse.left="goToNext"
        v-touch-swipe.mouse.right="goToPrevious"
      ></div>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="info" color="primary" @click="infoDrawerOpen = !infoDrawerOpen"/>
      </q-page-sticky>

      <q-page-sticky position="bottom-right" :offset="[18, 85]" v-if="media.mimetype && media.mimetype.match(/image\//)">
        <q-btn fab :icon="isZoomed ? 'zoom_out' : 'zoom_in'" color="primary" @click="toggleZoom"/>
      </q-page-sticky>
    </q-page>
  </div>
</template>

<script>
import InfoDrawer from '../components/InfoDrawer'
import VideoPlayer from '../components/VideoPlayer'

export default {
  components: {
    InfoDrawer,
    VideoPlayer
  },

  data () {
    return {
      infoDrawerOpen: false,
      media: {
        type: null
      },
      isZoomed: false,
      src: `${this.$config.server.base_url}/media/${this.$route.params.id}/original`,
      vidsrc: `${this.$config.server.base_url}/media/${this.$route.params.id}/playlist.m3u8`,
      videoOptions: {
        autoplay: true,
        controls: true,
        sources: [
          {
            src: `${this.$config.server.base_url}/media/${this.$route.params.id}/playlist.m3u8`,
            type: 'application/x-mpegURL',
            withCredentials: true
          }
        ]
      }
    }
  },

  async beforeCreate () {
    let response = await this.$axios.get(`${this.$config.server.base_url}/media/${this.$route.params.id}`)
    this.media = response.data
  },

  mounted () {
    window.addEventListener('keyup', this.onKeypress, false)
  },

  beforeDestroy () {
    window.removeEventListener('keyup', this.onKeypress, false)
  },

  methods: {
    toggleZoom () {
      this.isZoomed = !this.isZoomed
      if (this.isZoomed) {
        this.infoDrawerOpen = false
      }
    },

    mediaUpdated (media) {
      this.media = media
    },

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

      this.transition = 'slide-left'

      let index = this.$store.getters['media/getIndex']

      let media = this.$store.getters['media/getNext']
      index += 1

      if (media) {
        this.$store.commit('media/setIndex', index)
        this.$router.replace(media.url)
      }
    },

    goToPrevious () {
      if (this.isZoomed) {
        return
      }

      this.transition = 'slide-right'

      let index = this.$store.getters['media/getIndex']

      let media = this.$store.getters['media/getPrevious']
      index -= 1

      if (media) {
        this.$store.commit('media/setIndex', index)
        this.$router.replace(media.url)
      }
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

#swipe-overlay-handler {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
