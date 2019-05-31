import Vue from 'vue'

export function setMedia (state, media) {
  Vue.set(state, 'media', media)
}

export function setIndex (state, index) {
  Vue.set(state, 'index', index)
}
