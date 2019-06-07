<template>
  <q-btn-dropdown flat :label="currentLabel">
    <q-list>
      <q-item
        v-for="item in config"
        v-bind:key="item.route"
        clickable
        v-close-popup
        @click="$router.replace(item.route)"
      >
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  computed: {
    currentLabel () {
      let currentView = this.$route.path.match(/^\/(\w+)?/)

      switch (currentView[1]) {
        case 'albums':
          return 'Albums'
        case 'folders':
          return 'Folders'
      }

      return 'Media'
    },

    config () {
      let nav = [
        {
          name: 'Media',
          route: '/'
        },
        {
          name: 'Albums',
          route: '/albums'
        }
      ]

      let rootFolders = this.$store.getters['folders/rootFolders']
      if (this.$store.getters['users/isLoggedIn'] && rootFolders.length > 0) {
        nav.push({
          name: 'Folders',
          route: `/folders/${rootFolders[0].id}`
        })
      }

      return nav
    }
  }
}
</script>
