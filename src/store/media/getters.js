export function getMedia (state) {
  return state.albums
}

export function getIndex (state) {
  return state.index
}

export function getNext (state) {
  if (state.index === state.media.length - 1) {
    return null
  }

  return state.media[state.index + 1]
}

export function getPrevious (state) {
  if (state.index === 0) {
    return null
  }

  return state.media[state.index - 1]
}
