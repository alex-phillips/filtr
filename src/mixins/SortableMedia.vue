<script>
export default {
  data () {
    return {
      sortMode: 'date_added',
      sortOrder: 'desc'
    }
  },

  methods: {
    setSortConfig (config) {
      this.sortMode = config.mode
      this.sortOrder = config.order
    }
  }
}
</script>
