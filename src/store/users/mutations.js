import Vue from 'vue'
import { Cookies } from 'quasar'

export function setUser (state, user) {
  Vue.set(state, 'user', user)
  Vue.set(state, 'loggedIn', true)
}

export function logout (state) {
  Vue.set(state, 'user', {})
  Cookies.remove('jwt')
  Vue.set(state, 'loggedIn', false)
}
