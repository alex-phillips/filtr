import Vue from 'vue'

export function deleteAlbum (state, album) {
  Vue.set(state, 'albums', state.albums.filter(a => a.id !== album.id))
}

export function setAlbums (state, albums) {
  Vue.set(state, 'albums', albums)

  // Build our album tree reference only when we set albums
  // to prevent us from having to build it over and over and
  // over and over and over and over and... over again.
  var tree = [],
    mappedArr = {},
    arrElem,
    mappedElem

  // First map the nodes of the array to an object -> create a hash table.
  for (var i = 0, len = albums.length; i < len; i++) {
    arrElem = albums[i]
    arrElem.label = arrElem.name
    mappedArr[arrElem.id] = arrElem
    mappedArr[arrElem.id]['children'] = []
  }

  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id]
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.parentId) {
        mappedArr[mappedElem['parentId']]['children'].push(mappedElem)
      } else {
        // If the element is at the root level, add it to first level elements array.
        tree.push(mappedElem)
      }
    }
  }

  Vue.set(state, 'mappedAlbums', mappedArr)
  Vue.set(state, 'tree', tree)
}
