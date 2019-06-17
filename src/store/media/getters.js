export function getMedia (state) {
  return state.media
}

export function getIndex (state) {
  return state.index
}

export function getNext (state, getters) {
  let media = getters.getMedia
  let index = getters.getIndex
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

export function getFullPath (state) {
  return state.fullPath
}

export function sortMode (state) {
  return state.sortMode
}

export function sortOrder (state) {
  return state.sortOrder
}
