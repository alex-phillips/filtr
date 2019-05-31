<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Filtr
        </q-toolbar-title>

        <search></search>
      </q-toolbar>
    </q-header>

    <q-drawer
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
import Search from '../components/Search'

export default {
  name: 'FoldersLayout',

  components: {
    Search
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
