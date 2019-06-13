import Vue from 'vue'
import { Cookies } from 'quasar'

export function setMedia (state, media) {
  media = media.map(m => {
    return {
      id: m.id,
      url: m.url
    }
  })

  Vue.set(state, 'media', media)
  Cookies.set('media', JSON.stringify(media))
}

export function setIndex (state, index) {
  Vue.set(state, 'index', index)
  Cookies.set('media-index', index)
}

export function setSortMode (state, mode) {
  Vue.set(state, 'sortMode', mode)
}

export function setSortOrder (state, desc) {
  Vue.set(state, 'sortOrder', desc === true ? 'desc' : 'asc')
}
