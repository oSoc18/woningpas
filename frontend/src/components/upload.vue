<template>
    <div id="upload">
        <input type="file" accept=".pdf" @change="onFileSelected">
        <button @click="upload">Upload</button>
    </div>
</template>

<script>
import axios from 'axios'
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
        upload(content){
            var token = localStorage.getItem('token')
            var jsonToSend = {
              key: token,
              content: btoa(this.content)
            }
            axios.post('http://localhost:8080/upload', jsonToSend)
             .then(res => {
                console.log(res)
             })
        }
    }
}
</script>
