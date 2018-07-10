var http = require("http")
var fs = require("fs")
var key="";
var turn=true
var options = {
    host: "localhost",
    port: 8080,
    path: '/login?type=owner',
    method: 'GET'
};

var optionsInspector = {
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

var optionValidate = {
    host: "localhost",
    port: 8080,
    path: '/validate',
    method: 'POST'
}





restOfTheDamOwl= function(){
    sendFile = function(name, house){
        data=fs.readFileSync( __dirname + "/" + name, 'base64')
        jsonToSend = {
            key:key,
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
    postReq.write(sendFile("pdf-sample.pdf", "house1"))
    postReq.end()
    http.request(optionsInspector, function(res) {
        res.setEncoding('utf8');
        sumChunk=""
        res.on('data', function (chunk) {
            if (res.statusCode=200){
                sumChunk+=chunk
            }
        });
        res.on("end", function(){
            key=sumChunk
            owlingOfLaughter()
        })
    }).end();
}


owlingOfLaughter=function(){
    var postReq = http.request(optionValidate, function(res){
        if(res.statusCode===403){
            console.log("403 error")
        }
    })
    postReq.write(JSON.stringify({
        name:"pdf-sample.pdf",
        key:key
        })
    )
    postReq.end()
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
        restOfTheDamOwl()
    })
}).end();