import config from '../../config/app.json'

export default async ({ Vue }) => {
  Vue.prototype.$config = config[process.env.NODE_ENV || 'development']
}
