import config from '../../config/app.json'

export default async ({ Vue }) => {
  if (process.env.DEV) {
    Vue.prototype.$config = config.development
  } else {
    Vue.prototype.$config = config.production
  }
}
