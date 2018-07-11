import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'

Vue.use(Router)

var auth = {
  loggedIn(){
    var token = localStorage.getItem('token')
    if (token && token.length){
      return true
    }
    else{
      return false
    }
  }
}

function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login'
    })
  }
  else{
    next()
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      alias: '/login',
      //beforeEnter: requireAuth
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      beforeEnter: requireAuth
    }
  ]
})
