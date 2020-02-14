import Vue from 'vue'
import Router from 'vue-router'
import AuthRequired from '@/utils/AuthRequired'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "app" */ '@/views/app'),
    redirect: '/app/dashboards',
    // beforeEnter: AuthRequired,
    children: [
      {
        path: '/app/dashboards',
        component: () => import(/* webpackChunkName: "dashboards" */ '@/views/app/dashboards'),
        redirect: '/app/dashboards/content',
        children: [
          { path: 'content', component: () => import(/* webpackChunkName: "dashboards" */ '@/views/app/dashboards/Content') }
        ]
      },
      {
        path: 'app/admin',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/app/admin'),
        redirect: '/app/admin/plan-management/',
        children: [
          { path: 'users/:id', props: true, component: () => import(/* webpackChunkName: "admin" */ '@/views/app/admin/Users') },
          { path: 'users-plans/:id', props: true, component: () => import(/* webpackChunkName: "admin" */ '@/views/app/admin/UsersPlans') },
          { path: 'plan-management/:id', props: true, component: () => import(/* webpackChunkName: "admin" */ '@/views/app/admin/PlanManagement') }
        ]
      },
      {
        path: 'app/lists/:id',
        component: () => import(/* webpackChunkName: "lists" */ '@/views/app/lists')

      },
      {
        path: 'app/food-cost/:id',
        component: () => import(/* webpackChunkName: "foodcost" */ '@/views/app/food-cost')

      },
      {
        path: 'app/my-menu/:id',
        component: () => import(/* webpackChunkName: "mymenu" */ '@/views/app/my-menu')

      },
      {
        path: 'app/ricettario/:id',
        component: () => import(/* webpackChunkName: "recipes" */ '@/views/app/recipes')

      }
    ]
  },
  {
    path: '/plans',
    component: () => import(/* webpackChunkName: "plans" */ '@/views/plans')
  },
  {
    path: '/cart',
    component: () => import(/* webpackChunkName: "cart" */ '@/views/cart')
  },
  {
    path: '/terms',
    component: () => import(/* webpackChunkName: "terms" */ '@/views/terms')
  },
  { path: '/error', component: () => import(/* webpackChunkName: "error" */ '@/views/Error') },
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user'),
    redirect: '/user/login',
    children: [
      { path: 'login', component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login') },
      { path: 'register', component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register') },
      { path: 'forgot-password', component: () => import(/* webpackChunkName: "user" */ '@/views/user/ForgotPassword') },
      { path: 'email-not-verified', component: () => import(/* webpackChunkName: "user" */ '@/views/user/EmailNotVerified') },
      { path: 'actions', component: () => import(/* webpackChunkName: "user" */ '@/views/user/Actions') }
    ]
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "error" */ '@/views/Error')
  }
]

const router = new Router({
  linkExactActiveClass: 'active',
  base: '/',
  routes,
  mode: 'history'
})

export default router
