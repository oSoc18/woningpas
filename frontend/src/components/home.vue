<template>
  <div id="home">
    <div v-if="!role">
      <app-login></app-login>
    </div>
    <div v-else>
      <app-header></app-header>
      <div class="row">
        <app-sideBar></app-sideBar>
        <div id="main" class="col-xs-12 col-sm-6 col-md-8">
          <div id="central">

            <h1>Welcome {{role}},</h1>
            <button v-on:click="logout">Log out</button>
            <br><br>

            <div v-if="role == 'owner'">
              <h2>
                Here you can upload files and wait for an inspector to validate it
              </h2>
              <br><br>
              <app-upload></app-upload>
            </div>
            <div v-else-if="role == 'inspector'" id="inspector">
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
import auth from '@/js/auth.js'
import api from '@/js/api.js'
import file from '@/js/file.js'

export default {
  name: 'Home',
  data() {
    return {
      role: auth.getRole(),
      fileId: ''
    }
  },
  methods: {
    logout(){
      auth.logout(this)
    },
    download(){
      let data = {
        url: this.fileId,
        key: auth.getToken()
      }
      api.request('download', data, (data) => {
        file.download('file.pdf', atob(data.content));
      })
    },
    validate(){
      let data = {
        url: this.fileId,
        key: auth.getToken()
      }
      api.request('validate', data);
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
