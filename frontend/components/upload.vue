<template>
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
</template>

<script>
export default {
    name: 'Upload',
    methods: {
         submitFile(name, file, key){
            sendFile = function(nameFile, file, key){
                jsonToSend = {
                    key:key,
                    name: nameFile,
                    content: file
                }
                return JSON.stringify(jsonToSend)
            }
            var option = {
                host: "localhost",
                port: 8080,
                path: '/upload',
                method: 'POST'
            }
            var postReq = http.request(option, function(res){
                if(res.statusCode!=200){
                    console.log("Error with upload")
                }
            })
            postReq.write(sendFile(name, file, key))
            postReq.end()
        }
    }
}
</script>