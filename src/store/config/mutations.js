import Vue from 'vue'

export function setConfig (state, config) {
  Vue.set(state, 'config', config)
}
