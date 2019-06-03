import Vue from 'vue'

export async function fetchConfig ({ commit }) {
  let response = await Vue.prototype.$axios.get(`${Vue.prototype.$config.server.base_url}/config/`)
  commit('setConfig', response.data)
}
