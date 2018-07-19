import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
import NotFound from '@/components/notFound'
import Documents from '@/components/documents'
import Document from '@/components/document'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      alias: '/home',
      beforeEnter: (to, from, next) => {
        if (!localStorage.getItem('role') && !localStorage.getItem('token')) {
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
        if (localStorage.getItem('role') && localStorage.getItem('token')) {
          next('/home')
        }
        next()
      }
    },
    {
      path: '/documents',
      name: 'Documents',
      component: Documents
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
