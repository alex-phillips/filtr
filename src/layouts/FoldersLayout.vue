<template>
  <q-layout view="hHh Lpr lFf">
    <global-toolbar @toggle-drawer="$refs.settingsDrawer.toggle()"></global-toolbar>

    <q-drawer
      v-if="$store.getters['folders/rootFolders'].length > 0"
      v-model="drawerOpen"
      :breakpoint="700"
      show-if-above
      elevated
    >
      <q-scroll-area class="fit">
        <q-input ref="filter" filled v-model="filter" label="Filter" @keyup.esc="filter = ''">
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="filter = ''"/>
          </template>
        </q-input>

        <div class="q-pa-sm">
          <q-tree
            :nodes="folderTree"
            default-expand-all
            :selected.sync="selectedFolderId"
            node-key="id"
            @update:selected="goToFolder"
            :filter="filter"
          />
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.path" @toggle-drawer="drawerOpen = !drawerOpen"/>
    </q-page-container>
  </q-layout>
</template>

<style>
</style>

<script>
import GlobalToolbar from '../components/GlobalToolbar'

export default {
  name: 'FoldersLayout',

  components: {
    GlobalToolbar
  },

  data () {
    return {
      drawerOpen: true,
      selectedFolderId: null,
      filter: ''
    }
  },

  computed: {
    folderTree () {
      return this.$store.getters['folders/tree']
    }
  },

  mounted () {
    // Set the selected ID here since when we navigate to the route,
    // it isn't selected from the previous click
    this.selectedFolderId = parseInt(this.$route.params.id)
  },

  methods: {
    goToFolder () {
      // Apparently if you click on the node in the tree that is currently
      // selected, then the selected value becomes null...
      if (!this.selectedFolderId) {
        return
      }

      this.$router.push(`/folders/${this.selectedFolderId}`)
    }
  }
}
</script>
