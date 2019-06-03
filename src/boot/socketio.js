import VueSocketIO from 'vue-socket.io'

export default async ({ Vue }) => {
  Vue.use(new VueSocketIO({
    debug: true,
    // connection: `ws://${Vue.prototype.$config.server.base_url.replace(/http:\/\//, '')}`
    connection: Vue.prototype.$config.server.base_url
    // vuex: {
    //   store,
    //   actionPrefix: 'SOCKET_',
    //   mutationPrefix: 'SOCKET_'
    // },
    // options: { path: '/my-app/' } // Optional options
  }))
}
