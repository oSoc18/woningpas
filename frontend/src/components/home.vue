<template>
  <div id="home">
    <div v-if="!auth.loggedIn">
      <app-login></app-login>
    </div>
    <div v-else>
      <app-header></app-header>
      <div class="row">
        <app-sideBar></app-sideBar>
        <div id="main" class="col-xs-12 col-sm-6 col-md-8">
          <div id="central">

            <h1>Welcome {{auth.role}},</h1>
            <button v-on:click="logout">Log out</button>
            <br><br>

            <div v-if="auth.role == 'owner'">
              <h2>
                Here you can upload files and wait for an inspector to validate it
              </h2>
              <br><br>
              <app-upload></app-upload>
            </div>
            <div v-else-if="auth.role == 'inspector'" id="inspector">
              <h2>
                Here you can see view/download the file and validate it
              </h2>
              <table>
                <tr>
                  <td>
                    <input v-model="fileId" placeholder="file id">
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

      <!--<app-footer></app-footer>-->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import auth from './auth.js'
import api from './api.js'
import file from './file.js'

export default {
  name: 'Home',
  data() {
    return {
      role: '',
      token: '',
      fileId: '',
      auth: auth
    }
  },
  methods: {
    logout(){
      this.auth.logout()
      this.$router.push({ name: "Home"})
    },
    download(){
      var data = {
        url: this.fileId,
        key: localStorage.getItem('token')
      }
      api.request('download', data, (res) => {
        file.download('file.pdf', atob(res.data.content));
      })
    },
    validate(){
      var jsonToSend = {
        url: this.fileId,
        key: localStorage.getItem('token')
      }
      axios.post('http://localhost:8080/validate', jsonToSend)
        .then(res => {
          console.log(res)
        })
    }
  }
}
</script>

<style scoped>
  #main{
    padding-left: 6%;
    padding-right: 6%;
  }
</style>
