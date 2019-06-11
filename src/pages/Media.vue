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

  methods: {
    toggleZoom () {
      this.isZoomed = !this.isZoomed
      if (this.isZoomed) {
        this.infoDrawerOpen = false
      }
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
