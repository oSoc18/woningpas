<template>
  <div id="home">
    <div v-if="!auth.loggedIn">
      <app-login></app-login>
    </div>
    <div v-else>
      <!--<app-header></app-header>
      <app-sideBar></app-sideBar>
      <app-footer></app-footer>-->
      <div v-if="auth.role == 'owner'">
        <app-upload></app-upload>
      </div>      
      <button v-on:click="logout">Log out</button>
      <div id="mainContent">
        <h1>Welcome {{auth.role}},</h1>
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
      auth: auth
    }
  },
  methods: {
    logout(){
      auth.logout()
      this.$router.push({ name: "Home"})
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
