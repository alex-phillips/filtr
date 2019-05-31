// import Vue from 'vue'

// export async function fetchAlbums ({ commit }) {
//   let response = await Vue.prototype.$axios.get(`${Vue.prototype.$config.server.base_url}/albums/`)
//   commit('setAlbums', response.data)
// }

// export async function addToAlbum ({ dispatch }, payload) {
//   await Vue.prototype.$axios.put(`${Vue.prototype.$config.server.base_url}/albums/${payload.album.id}/media/${payload.ids.join(',')}`)
//   dispatch('fetchAlbums')
// }
