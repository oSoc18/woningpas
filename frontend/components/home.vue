<template>
  <div id="home">
    <div v-if="!auth.loggedIn">
      <app-login></app-login>
    </div>
    <div v-else>
      <!--<app-header></app-header>
      <app-sideBar></app-sideBar>
      <app-footer></app-footer>-->
      <app-upload></app-upload>
      <button v-on:click="logout">Log out</button>
      <div id="mainContent">
        <h1>Welcome {{username}},</h1>
        <!--<p>Your documents</p>-->      
        <table>
          <tr></tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import auth from './auth.js'
export default {
  name: 'Home',
  data() {
    return {
      username: '',
      auth: auth
    }
  },
  computed: {
    username: function () {
      if (localStorage.getItem(role)) {
        return "" + localStorage.getItem(role)
      }
      return ''
    }
  },
  methods: {
    logout(){
      auth.logout()
       this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
  #home {
    background-color: #FFFFFF;
    border: 1px solid #CCCCCC;
    padding: 20px;
    margin-top: 10px;
  }
</style>
