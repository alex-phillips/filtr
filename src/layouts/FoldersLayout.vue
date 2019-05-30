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
      :width="250"
      :breakpoint="700"
      show-if-above
      elevated

    >
      <q-scroll-area class="fit">
        <div class="q-pa-sm">
          <q-tree
            :nodes="folderTree"
            default-expand-all
            :selected.sync="selectedFolderId"
            node-key="id"
            @update:selected="$router.push(`/folders/${selectedFolderId}`)"
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
      selectedFolderId: null
    }
  },

  computed: {
    folderTree () {
      return this.$store.getters['folders/tree']
    }
  }
}
</script>
