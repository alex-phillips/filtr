<script>
import querystring from 'querystring'

export default {
  data () {
    return {
      // Entities
      album: {},
      media: [],
      albums: [],

      albumUrl: '',
      mediaUrl: '',
      query: {}
    }
  },

  methods: {
    async getData (index, done) {
      let restored = this.restorePrevious()

      this.$root.$emit('restoreScroll')

      if (restored) {
        if (done) {
          done()
        }

        return
      }

      this.$store.commit('media/setFullPath', this.$route.fullPath)

      if (this.albumUrl) {
        let response = await this.$axios.get(`${this.albumUrl}`)
        this.album = response.data
        this.albums = this.album.children
      }

      let query = {
        ...this.query,
        offset: this.media.length,
        sortMode: this.$store.getters['media/sortMode'],
        order: this.$store.getters['media/sortOrder']
      }

      let response = await this.$axios.get(`${this.mediaUrl}?${querystring.stringify(query)}`)

      // Handle the case where this returns albums, media, or both
      if (response.data.media || response.data.albums) {
        this.media = this.media.concat(response.data.media || [])
        this.albums = response.data.albums || []
      } else {
        this.media = this.media.concat(response.data)
      }

      if (response.data.length === 0) {
        return
      }

      if (done) {
        done()
      }
    },

    restorePrevious () {
      if (this.initialLoad) {
        this.initialLoad = false
        return false
      }

      let lastRoute = this.$store.getters['media/getFullPath']
      if (lastRoute !== this.$route.fullPath) {
        return false
      }

      let retval = false
      if (this.media.length === 0) {
        this.media = this.$store.getters['media/getMedia']
        if (this.media.length !== 0) {
          retval = true
        }
      }

      if (this.albums.length === 0) {
        this.albums = this.$store.getters['media/getAlbums']
        if (this.albums.length !== 0) {
          retval = true
        }
      }

      return retval
    }
  }
}
</script>
