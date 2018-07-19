import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
import House from '@/components/house'
import NotFound from '@/components/notFound'
import auth from '@/js/auth.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      alias: '/home',
      beforeEnter: (to, from, next) => {
        if (!auth.getRole()) {
          next('/login')
        }
        next()
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (auth.getRole()) {
          next('/home')
        }
        next()
      }
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/house',
      name: 'House',
      component: House
    }
  ]
})
