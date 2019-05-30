import Vue from 'vue'

export async function fetchAlbums ({ commit }) {
  let response = await Vue.prototype.$axios.get(`${Vue.prototype.$config.server.base_url}/albums/`)
  commit('setAlbums', response.data)
}
