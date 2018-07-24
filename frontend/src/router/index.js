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
import DocumentView from '@/components/documentView'
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
      path: '/house/:houseId',
      name: 'House',
      component: House,
      beforeEnter: (to, from, next) => {
        if (!auth.getRole()) {
          next('/login')
        }
        else if (auth.getRole() == 'inspector') {
          next('/pageNotFound')
        }
        next()
      }
    },
    {
      path: '/owner/:owner/house/:houseId/document/:documentId',
      name: 'DocumentView',
      component: DocumentView,
      beforeEnter: (to, from, next) => {
        if (!auth.getRole()) {
          next('/login')
        }
        else if (auth.getRole() == 'owner') {
          next('/pageNotFound')
        }
        next()
      }
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
