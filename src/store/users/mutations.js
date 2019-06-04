import Vue from 'vue'
import { LocalStorage } from 'quasar'

export function setUser (state, user) {
  Vue.set(state, 'user', user)
  Vue.prototype.$axios.defaults.headers.common.Authorization = user.token
  LocalStorage.set('user', user)
  Vue.set(state, 'loggedIn', true)
}

export function logout (state) {
  Vue.set(state, 'user', {})
  LocalStorage.set('user', null)
  Vue.set(state, 'loggedIn', false)
}
