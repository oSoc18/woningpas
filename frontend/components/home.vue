<template>
  <div id="home">
    <!--<app-header></app-header>
    <app-sideBar></app-sideBar>
    <app-footer></app-footer>-->
    <div id="mainContent">
      <h1>Welcome {{username}},</h1>
      <p>Your documents</p>
      <table>
        <tr></tr>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        username: 'PIETER',
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