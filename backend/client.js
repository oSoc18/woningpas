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

var optionsList= {
    host:"localhost",
    port:8080,
    path:"/listFiles?key=",
    method:"GET"
}
var optionsInspector = {
    host: "localhost",
    port: 8080,
    path: '/login?type=inspector',
    method: 'GET'
};

var optionsDownload = {
    host: "localhost",
    port: 8080,
    path: '/download?name=pdf-sample.pdf&key=',
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
    optionsList.path+=key
    
    http.request(optionsList, function(res) {
        sumChunk=""
        res.on('data', function (chunk) {
            sumChunk+=chunk
        });
        res.on("end", function(){
            console.log(sumChunk)
        })
    }).end();

    sendFile = function(nameFile, house){
        data=fs.readFileSync( __dirname + "/" + nameFile, 'base64')
        jsonToSend = {
            key:key,
            name: nameFile,
            data: data
        }
        return JSON.stringify(jsonToSend)
    }
    
    var postReq = http.request(optionPost, function(res){
        if(res.statusCode!=200){
            console.log("Error")
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
        if(res.statusCode!=200){
            console.log("Error")
        }
    })
    postReq.write(JSON.stringify({
        name:"pdf-sample.pdf",
        key:key
        })
    )
    postReq.end()

    optionsDownload.path+=key
    http.request(optionsDownload, function(res) {
        sumChunk=""
        res.on('data', function (chunk) {
            sumChunk+=chunk
        });
        res.on("end", function(){
            data=JSON.parse(sumChunk).data
            fs.writeFileSync( __dirname + "/savePerso/" + "pdf-sample.pdf", data, 'base64')
        })
    }).end();
}




http.request(options, function(res) {
    res.setEncoding('utf8');
    sumChunk=""
    res.on('data', function (chunk) {
        if (res.statusCode===200){
            sumChunk+=chunk
        }
    });
    res.on("end", function(){
        key=sumChunk
        restOfTheDamOwl()
    })
}).end();