<template>
  <q-layout
    view="hHh Lpr lFf"
    @keyup.escape="$router.push(-1)"
    v-touch-swipe.mouse.left="goToNext"
    v-touch-swipe.mouse.right="goToPrevious"
  >
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
      <transition :name="transition" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import AlbumSelector from '../components/dlg/AlbumSelector'

export default {
  components: {
    AlbumSelector
  },

  data () {
    return {
      transition: 'fade'
    }
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
    },

    async addToAlbum (album) {
      await this.$axios.put(`${this.$config.server.base_url}/media/${this.media.id}/`, {
        albums: this.media.albums.concat([album.id])
      })
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
