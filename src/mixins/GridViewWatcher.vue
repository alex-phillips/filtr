<script>
export default {
  data () {
    return {
      selectedMedia: [],
      selectMode: false
    }
  },

  methods: {
    selected (selectedMedia) {
      this.selectedMedia = [...selectedMedia]
      this.selectMode = selectedMedia.size !== 0
    },

    async addToAlbum (album) {
      let ids = [...this.selectedMedia].map(m => m.id)
      this.$store.dispatch('albums/addToAlbum', {
        album: album,
        ids: ids
      })
    }
  }
}
</script>
