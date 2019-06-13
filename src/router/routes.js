
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Photos.vue') }
    ]
  },
  {
    path: '/albums',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Albums.vue') }
    ]
  },
  {
    path: '/media/:id',
    component: () => import('layouts/MediaViewerLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Media.vue') }
    ]
  },
  {
    path: '/albums/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Album.vue') }
    ]
  },
  {
    path: '/tags/:id',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Tag.vue') }
    ]
  },
  {
    path: '/folders/:id',
    component: () => import('layouts/FoldersLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Folder.vue') }
    ]
  },
  {
    path: '/search',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Search.vue') }
    ]
  },
  {
    path: '/install',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Install.vue') }
    ]
  },
  {
    path: '/settings',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('layouts/Settings.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/Settings/Settings.vue')
          },
          {
            path: 'account',
            component: () => import('pages/Settings/Account.vue')
          }
        ]
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
