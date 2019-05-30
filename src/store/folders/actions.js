import Vue from 'vue'

export async function fetchFolders ({ commit }) {
  let response = await Vue.prototype.$axios.get(`${Vue.prototype.$config.server.base_url}/folders/`)
  commit('setFolders', response.data)
}
