import Vue from 'vue'

export async function getTags ({ commit }) {
  let response = await Vue.prototype.$axios.get(`${Vue.prototype.$config.server.base_url}/tags/`)
  commit('updateTags', response.data)
}
