<template>
    <div id="upload">
        <input type="file" accept=".pdf" @change="onFileSelected">
        <button @click="upload">Upload</button>
    </div>
</template>

<script>
import auth from '@/js/auth.js'
import api from '@/js/api.js'

export default {
    name: 'Upload',
    data() {
        return {
            content: ''
        }
    },
    methods: {
        onFileSelected(event){
            let self = this;
            let reader = new FileReader();
            reader.onloadend = function() {
              self.content = reader.result;
            };
            reader.readAsBinaryString(event.target.files[0]);
        },
        upload(){
            var data = {
              key: auth.getToken(),
              content: btoa(this.content)
            }
            api.request('upload', data);
        }
    }
}
</script>
