// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import header from '@/components/header'
import sideBar from '@/components/sideBar'
import footer from '@/components/footer'
import upload from '@/components/upload'
import login from '@/components/login'
import house from '@/components/house'
import pageNotFound from '@/components/pageNotFound'
import houseList from '@/components/houseList'
import documents from '@/components/documents'
import document from '@/components/document'
import viewPDF from '@/components/viewPDF'
import documentView from '@/components/documentView'

Vue.component('app-header', header)
Vue.component('app-sideBar', sideBar)
Vue.component('app-footer', footer)
Vue.component('app-upload', upload)
Vue.component('app-login', login)
Vue.component('app-pageNotFound', pageNotFound)
Vue.component('app-documents', documents)
Vue.component('app-document', document)
Vue.component('app-house', house)
Vue.component('app-houseList', houseList)
Vue.component('app-viewPDF', viewPDF)
Vue.component('app-documentView', documentView)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
