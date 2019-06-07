import Vue from 'vue'

export function setMedia (state, media) {
  Vue.set(state, 'media', media)
}

export function setIndex (state, index) {
  Vue.set(state, 'index', index)
}

export function setSortMode (state, mode) {
  Vue.set(state, 'sortMode', mode)
}

export function setSortOrder (state, desc) {
  Vue.set(state, 'sortOrder', desc === true ? 'desc' : 'asc')
}
