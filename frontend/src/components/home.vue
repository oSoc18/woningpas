<template>
  <div id="home">
    <div v-if="!auth.loggedIn">
      <app-login></app-login>
    </div>
    <div v-else>
      <!--<app-header></app-header>
      <app-sideBar></app-sideBar>
      <app-footer></app-footer>-->
      <div id="mainContent">
        <h1>Welcome {{auth.role}},</h1>
        <button v-on:click="logout">Log out</button><br>
        <div v-if="auth.role == 'owner'">
          <app-upload></app-upload>
        </div>
        <div v-else-if="auth.role == 'inspector'">
          <table>
            <tr>
              <td>
                <input v-model="filename" placeholder="file name">
              </td>
              <td>
                <button v-on:click="download" class="btn btn-primary">Download</button>
              </td>
              <td>
                <button v-on:click="validate" class="btn btn-success">Validate</button>
              </td>
            </tr>
          </table>          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import auth from './auth.js'
export default {
  name: 'Home',
  data() {
    return {
      auth: auth,
      role: localStorage.getItem('role'),
      key: localStorage.getItem('token'),
      loggedIn: localStorage.getItem('role'),      
      filename: ''
    }
  },
  methods: {
    logout(){
      auth.logout()
      this.$router.push({ name: "Home"})
    },
    download(){
      axios({
        url: 'http://localhost:8080/download?name='+this.filename+'&key=' + this.auth.key,
        method: 'GET',
        responseType: 'blob',
      }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'file.pdf')
        document.body.appendChild(link)
        link.click()
        console.log(res)
      })
      .catch(error => {
        console.log(error)
      })
    },
    validate(){
      var postReq= axios.post('http://localhost:8080/validate')
      postReq.write(
        JSON.stringify({
          name: this.filename,
          key: this.auth.key
        })
      )
      postReq.end()
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
