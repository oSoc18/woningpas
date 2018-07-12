<template>
    <div id="upload">
        <input type="file" accept=".pdf" @change="onFileSelected">
        <button @click="onUpload">Upload</button>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'Upload',
    data() {
        return {
            selectedFile: null
        }
    },
    methods: {
        onFileSelected(event){
            this.selectedFile = event.target.files[0]
        },
        onUpload(){
            var token = localStorage.getItem('token')
            var jsonToSend = {
              key: token,
              name: this.selectedFile.name,
              content: this.selectedFile
            }
            axios.post('http://localhost:8080/upload', jsonToSend)
             .then(res => {
                console.log(res)
             })
        }
    }
}
</script>
