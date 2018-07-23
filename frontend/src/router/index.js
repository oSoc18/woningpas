import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
import House from '@/components/house'
import PageNotFound from '@/components/pageNotFound'
import HouseList from '@/components/houseList'
import Documents from '@/components/documents'
import Document from '@/components/document'
import ViewPDF from '@/components/viewPDF'
import auth from '@/js/auth.js'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
      path: '/documents',
      name: 'Documents',
      component: Documents
    },
    {
      path: '/house/:id',
      name: 'House',
      component: House,
      props: true
    },
    {
      path: '/viewPDF',
      name: 'ViewPDF',
      component: ViewPDF
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})
