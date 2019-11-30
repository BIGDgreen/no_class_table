import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login/login'

Vue.use(Router);

 const routerMap = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      /**
       *   登录注册相关
       */
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
      /**
       * 平台相关
       */
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
});

routerMap.beforeEach((to,from,next) => {
  const logined = !!localStorage.getItem("logined");
  if ( to.path !== '/' && to.path !== '/addCourse' && to.path !== '/editCourse' ) {   // 与登录注册有关的页面可以直接跳转
    next();
  } else {
      if (logined) {
        next();
      } else {
        next("/login");
      }
  }
});

export default routerMap;
