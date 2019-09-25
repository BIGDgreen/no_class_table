import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login/login'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      //登录注册
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/selectCode',
      name: 'selectCode',
      component: () => import('./views/login/selectCode.vue')
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/login/register')
    },
    {
      path: '/phoneRegister',
      name: 'phoneRegister',
      component: () => import('./views/login/phoneRegister.vue')
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: () => import('./views/login/forgetPassword.vue')
    },
    {
      path: '/forgetPassword/resetPassword',
      name: 'resetPassword',
      component: () => import('./views/login/resetPassword.vue')
    },
      //主页
    {
      path: '/',
      name: 'main',
      component: () => import('./views/mainPage/main.vue')
    },
    {
      path: '/addCourse',
      name: 'addCourse',
      component: () => import('./views/mainPage/addCourse.vue')
    },
    {
      path: '/editCourse',
      name: 'editCourse',
      component: () => import('./views/mainPage/editCourse.vue')
    }
  ]
})
