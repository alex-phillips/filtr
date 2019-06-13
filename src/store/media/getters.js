import { Cookies } from 'quasar'

export function getMedia (state) {
  if (state.media.length === 0) {
    return Cookies.get('media')
  }

  return state.media
}

export function getIndex (state) {
  if (state.index === null) {
    return Cookies.get('media-index')
  }

  return state.index
}

export function getNext (state, getters) {
  let media = getters.getMedia
  let index = getters.getIndex
  console.log('index: ', index)
  if (index === media.length - 1) {
    return null
  }

  return media[index + 1]
}

export function getPrevious (state, getters) {
  let media = getters.getMedia
  let index = getters.getIndex
  if (index === 0) {
    return null
  }

  return media[index - 1]
}

export function sortMode (state) {
  return state.sortMode
}

export function sortOrder (state) {
  return state.sortOrder
}
