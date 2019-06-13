<template>
  <q-layout
    view="hHh Lpr lFf"
    @keyup.escape="$router.push(-1)"
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

  methods: {
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
