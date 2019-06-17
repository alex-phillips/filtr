<script>
import querystring from 'querystring'

export default {
  data () {
    return {
      dataUrl: '',
      query: {},
      media: []
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

      let query = {
        ...this.query,
        offset: this.media.length,
        sortMode: this.$store.getters['media/sortMode'],
        order: this.$store.getters['media/sortOrder']
      }

      let response = await this.$axios.get(`${this.dataUrl}?${querystring.stringify(query)}`)

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

      if (this.media.length === 0) {
        this.media = this.$store.getters['media/getMedia']
        if (this.media.length !== 0) {
          return true
        }
      }

      return false
    }
  }
}
</script>
