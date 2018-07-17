<template>
  <div id="header">
    <ul>
      <li id="brand">
        <a href="/home">
          <img src="@/assets/flandre.jpg" width="30" height="30" alt="logo">
        </a>
      </li>
      <li id="region">
        <h6><b>Flanders</b></h6>
      </li>
      <li id="appName"><h6><b>WONINGPAS</b></h6></li>
      <span>
        <li id="role"><h6>Role</h6></li>
        <li id="profilPicture">
          <img src="@/assets/profil.jpg" width="20" height="20" alt="profil picture">
        </li>
        <li id="contact"><a href="#">CONTACT US</a></li>
      </span>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Header',
    data(){
      return{
        username: localStorage.getItem('role')
      }
    }
  }
</script>

<style scoped>
#brand {
  margin-top: -5px;
}
#brand, #region, #profilPicture {
  padding-right: 15px;
  border-right: 1px solid black;
}
#region, #appName, #role {
  margin-left: 10px;
  padding-top: 15px;
}
#region {
  padding-bottom: 5px;
}
#profilPicture {
  padding-top: 10px;
  padding-left: 8px;
  padding-bottom: 8px;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: lightgray;
  height: 45px;
}

li {
  float: left;
}

li a {
  display: block;
  color: black;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li a:hover:not(.active) {
  background-color: blue;
}

.active {
  background-color: #4CAF50;
}
span {
  float: right;
}
#header {
  border-bottom: solid 1px lightgray;
}
</style>