<template>
  <div>
    <div v-if="uploading" class="is-loading is-loading--big is-loading--before">
      <p class="u-tac">Uploading document ...</p>
    </div>
    <button v-else class="a-button" @click="addDocument">Add document</button>
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

      let self = this;
      api.request('addDocument', data, function(data) {
        self.uploading = false;
        self.$emit('uploaded');
      });
    }
  }
}
</script>
<style scoped>
input[type=file] {
  display: none;
}
</style>
