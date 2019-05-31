import Vue from 'vue'
import Vuex from 'vuex'

import tags from './tags'
import albums from './albums'
import folders from './folders'
import media from './media'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      tags,
      albums,
      folders,
      media
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
