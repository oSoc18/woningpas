var http = require("http")
var fs = require("fs")
var key="";
var options = {
    host: "localhost",
    port: 8080,
    path: '/login?type=inspector',
    method: 'GET'
};

var optionPost = {
    host: "localhost",
    port: 8080,
    path: '/upload',
    method: 'POST'
}

http.request(options, function(res) {
    res.setEncoding('utf8');
    sumChunk=""
    res.on('data', function (chunk) {
        if (res.statusCode=200){
            sumChunk+=chunk
        }
    });
    res.on("end", function(){
        key=sumChunk
        console.log(key)
    })
}).end();
/*
sendFile = function(name, house){
    data=fs.readFileSync( __dirname + "/" + name, 'base64')
    jsonToSend = {
        house:house,
        name: name,
        data: data,
        form:{
            score:333
        }
    }
    return JSON.stringify(jsonToSend)
}

var postReq = http.request(optionPost, function(res){
    if(res.statusCode===403){
        console.log("403 error")
    }
})
postReq.write(sendFile("mini-memoire.pdf", "house1"))
postReq.end()*/