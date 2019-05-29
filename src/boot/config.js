import config from '../../config'

export default async ({ Vue }) => {
  Vue.prototype.$config = config
}
