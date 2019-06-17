<script>
export default {
  data () {
    return {
      dataUrl: '',
      media: []
    }
  },

  methods: {
    async getData (index, done) {
      let restored = this.restorePrevious()
      console.log('restored: ', restored)

      this.$root.$emit('restoreScroll')

      if (restored) {
        if (done) {
          console.log('calling done')
          done()
        }

        return
      }

      this.$store.commit('media/setFullPath', this.$route.fullPath)

      let query = {
        offset: this.media.length,
        sortMode: this.$store.getters['media/sortMode'],
        order: this.$store.getters['media/sortOrder']
      }
      query = Object.keys(query).map((key, i) => `${key}=${query[key]}`).join('&')

      let response = await this.$axios.get(`${this.dataUrl}?${query}`)
      this.media = this.media.concat(response.data)

      if (response.data.length === 0) {
        return
      }

      if (done) {
        done()
      }
    },

    restorePrevious () {
      let lastRoute = this.$store.getters['media/getFullPath']
      if (lastRoute !== this.$route.fullPath) {
        return false
      }

      if (this.media.length === 0) {
        console.log('attempting to get stored media...')
        console.log(this.$store.getters['media/getMedia'])
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
