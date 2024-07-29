import { Router, createRouter, createWebHashHistory } from 'vue-router'

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/Bilibili'
    },
    {
      path: '/home',
      component: () => import('../components/home.vue')
    },
    {
      path: '/s3',
      component: () => import('../components/S3Upload.vue')
    },
    {
      path: '/test/:id',
      component: () => import('../components/test.vue')
    },
    {
      path: '/bilibili',
      component: () => import('../components/Bilibili.vue')
    }
  ],
})

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(() => {
})

export default router

