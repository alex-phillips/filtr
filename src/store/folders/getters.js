export function allFolders (state) {
  return state.folders
}

export function rootFolders (state) {
  return state.folders.filter(a => a.parentId === null)
}

export function tree (state) {
  return state.tree
}

export function mappedFolders (state) {
  return state.mappedFolders
}

export function getFolderLineage (state) {
  return folderId => {
    let lineage = []
    lineage.push(state.mappedFolders[folderId])
    while (lineage[lineage.length - 1].parentId !== null) {
      lineage.push(state.mappedFolders[lineage[lineage.length - 1].parentId])
    }

    return lineage.reverse()
  }
}

// https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
// export function albumTree (state) {
//   let folders = state.folders
//   let map = {}, node, roots = [], i

//   for (i = 0; i < folders.length; i += 1) {
//     map[folders[i].id] = i // initialize the map
//     folders[i].children = [] // initialize the children
//     folders[i].label = folders[i].name
//   }

//   console.log(map)

//   for (i = 0; i < folders.length; i += 1) {
//     node = folders[i]
//     if (node.parentId !== null) {
//       // if you have dangling branches check that map[node.parentId] exists
//       folders[map[node.parentId]].children.push(node)
//     } else {
//       roots.push(node)
//     }

//     console.log(roots)
//   }

//   return roots
// }
