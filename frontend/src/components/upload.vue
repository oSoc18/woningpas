<template>
  <div>
    <!--h2>Add a document</h2><br-->
    <button class="a-button" :disabled="uploading" @click="addDocument">Add document</button>
    <input id="file" type="file" accept=".pdf" @change="fileChanged">
  </div>
</template>

<script>
import auth from '@/js/auth.js'
import api from '@/js/api.js'

export default {
  name: 'Upload',
  props: ['houseId'],
  data() {
    return {
      uploading: false
    }
  },
  methods: {
    addDocument: function(event) {
      $('#file').click();
    },
    fileChanged: function(event) {
      let upload = this.upload;
      console.log('reading file');
      let reader = new FileReader();
      reader.onloadend = function() {
        upload(reader.result);
      };
      reader.readAsBinaryString(event.target.files[0]);
    },
    upload: function(content) {
      console.log('uploading');
      this.uploading = true;
      var data = {
        key: auth.getToken(),
        content: btoa(content),
        houseId: this.houseId
      }
      api.request('addDocument', data);
    }
  }
}
</script>
<style scoped>
input[type=file] {
  display: none;
}
</style>
