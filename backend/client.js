var http = require("http")
var fs = require("fs")
var options = {
    host: "localhost",
    port: 8080,
    path: '/isCorrectPassword?name=house1&password=test1',
    method: 'GET'
};

var optionPost = {
    host: "localhost",
    port: 8080,
    path: '/upload',
    method: 'POST'
}
/*
http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
}).end();*/
sendFile = function(name, extension){
    data=fs.readFileSync( __dirname + "/" + name+"."+extension, 'utf8')
    jsonToSend = {
        name: name,
        extension: extension,
        data: data
    }
    return JSON.stringify(jsonToSend)
}

var postReq = http.request(optionPost, function(res){
})
postReq.write(sendFile("logo", "svg"))
console.log("success")
postReq.end()