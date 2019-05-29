export function albums (state) {
  return state.albums
}

export function rootAlbums (state) {
  return state.albums.filter(a => a.parentId === null)
}

export function albumTree (state) {
  return state.albumTree
}

export function mappedAlbums (state) {
  return state.mappedAlbums
}

export function getAlbumLineage (state) {
  return albumId => {
    let lineage = []
    lineage.push(state.mappedAlbums[albumId])
    while (lineage[lineage.length - 1].parentId !== null) {
      lineage.push(state.mappedAlbums[lineage[lineage.length - 1].parentId])
    }

    return lineage
  }
}

// https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
// export function albumTree (state) {
//   let albums = state.albums
//   let map = {}, node, roots = [], i

//   for (i = 0; i < albums.length; i += 1) {
//     map[albums[i].id] = i // initialize the map
//     albums[i].children = [] // initialize the children
//     albums[i].label = albums[i].name
//   }

//   console.log(map)

//   for (i = 0; i < albums.length; i += 1) {
//     node = albums[i]
//     if (node.parentId !== null) {
//       // if you have dangling branches check that map[node.parentId] exists
//       albums[map[node.parentId]].children.push(node)
//     } else {
//       roots.push(node)
//     }

//     console.log(roots)
//   }

//   return roots
// }
