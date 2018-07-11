// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import header from '@/components/header'
import sideBar from '@/components/sideBar'
import footer from '@/components/footer'
import upload from '@/components/upload'

Vue.component('app-header', header)
Vue.component('app-sideBar', sideBar)
Vue.component('app-footer', footer)
Vue.component('app-upload', upload)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})