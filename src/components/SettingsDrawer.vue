<template>

</template>

<script>
import SettingsMenu from './SettingsMenu'

export default {
  components: {
    SettingsMenu
  },

  data () {
    return {
      searchText: '',
      drawerIsOpen: false
    }
  },

  methods: {
    toggle () {
      this.drawerIsOpen = !this.drawerIsOpen
    }
  }
}
</script>
