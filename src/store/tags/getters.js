export function getTags (state) {
  return state.tags
}

export function getTagByID (state, id) {
  let retval = state.tags.filter(t => t.id === id)
  if (retval.length === 1) {
    return retval[0]
  }

  return null
}

export function getTagsByIDs (state, getters) {
  return ids => state.tags.filter(t => ids.includes(t.id))
}
