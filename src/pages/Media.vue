<template>
  <div
    v-touch-swipe.mouse.left="goToNext"
    v-touch-swipe.mouse.right="goToPrevious"
  >
    <info-drawer
      v-if="media.id"
      :media="media"
      :drawerOpen="infoDrawerOpen"
      @mediaUpdated="mediaUpdated"
    ></info-drawer>

    <q-page>
      <img class="media media-fit" :src="src" contain v-if="media.mimetype && media.mimetype.match(/image\//)"/>
      <video-player :options="videoOptions"
        class="media"
        v-if="media.mimetype && media.mimetype.match(/video\//)"
        style="width: 100%; height: 100%;"
      />

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="info" color="primary" @click="infoDrawerOpen = !infoDrawerOpen"/>
      </q-page-sticky>

      <q-page-sticky position="bottom-right" :offset="[18, 85]" v-if="media.mimetype && media.mimetype.match(/image\//)">
        <q-btn fab icon="zoom_in" color="primary" @click="toggleZoom"/>
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
      window.location.href = this.src
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
