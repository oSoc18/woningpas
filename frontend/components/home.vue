<template>
  <div id="home">
    <!--<app-header></app-header>
    <app-sideBar></app-sideBar>
    <app-footer></app-footer>-->
    <div id="upload">
        <div class="container">
            <div class="large-12 medium-12 small-12 cell">
            <label>File
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </label>
                <button v-on:click="submitFile()">Submit</button>
            </div>
        </div>
    </div>
    <div id="mainContent">
      <!--<router-link v-if="loggedIn" to="/logout">Log out</router-link>-->
      <h1>Welcome {{username}},</h1>
      <div id=""></div>
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
        name: '',
        file: '',
        key: ''
      }
    },
    methods: {
      submitFile(){
        var filename = this.$refs.file.files[0].name
        var file = this.$refs.file.files[0]
        var key = localStorage.getItem('token')

          var sendFile = function(filename, file, key){
            var jsonToSend = {
              key: key,
              name: filename,
              content: file
            }
            console.log("" + this.$refs.file.files[0].name)
            return JSON.stringify(jsonToSend)
          }
          var option = {
              host: "localhost",
              port: 8080,
              path: '/upload',
              method: 'POST'
          }
          var http = require('http')
          var postReq = http.request(option, function(res){
              if(res.statusCode!=200){
                  console.log("Error with upload")
              }
          })
          postReq.write(sendFile(filename, file, key))
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