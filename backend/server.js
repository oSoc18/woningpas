var express = require('express');
var app = express();
var fs = require("fs");
var qs = require('querystring');
var uuid = require("uuid/v4")
var statusSuccess=200
var statusError=400
var connected={
    inspector:[],
    owner:[],
    admin:[]
}

app.get('/listFiles', function (req, res) {
    console.log("listing files")
    data = fs.readFileSync( __dirname + "/" + "houses.json", 'utf8')
    key=req.query.key
    if(connected.inspector.includes(key) || connected.owner.includes(key) || connected.admin.includes(key)) {
        res.status(statusSuccess)

        res.write(JSON.stringify({data:data}));
    }
    else{
        res.status(statusError)
    }
    res.end()
})



app.get('/login', function(req, res){
    console.log("login")
    type = req.query.type
    if(type==="inspector" || type ==="admin" || type==="owner"){
        res.status(statusSuccess)
        key = uuid()
        connected[type].push(key)
        res.write(JSON.stringify({key:key}))
    }
    else{
        res.status(statusError)
    }
    res.end()
})

app.get('/download', function(req, res){
    console.log("download")
    var name = req.query.name
    var key = req.query.key

    sendFile = function(name){
        data=fs.readFileSync( __dirname + "/" + name, 'base64')
        jsonToSend = {
            key:key,
            name: name,
            data: data,
        }
        return JSON.stringify(jsonToSend)
    }
    var file = fs.readFileSync( __dirname + "/" + "houses.json", 'utf8')
    var certificate = JSON.parse(file)
    if( (connected.inspector.includes(key) || connected.owner.includes(key) || connected.admin.includes(key)) &&
    certificate.hasOwnProperty(name)){
         res.status(statusSuccess)
        res.write(sendFile(name, "base64"))
        res.end()
    }
    else{
        console.log("error")
        res.status(statusError)
    }
    res.end()
})

app.post('/validate', function(req, res){
    console.log("validate")
    var body ="";
    req.on('data', function(data){
        body += data;
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) { 
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            req.connection.destroy();
        }
    });
    req.on('end', function () {
        result=JSON.parse(body)
        splitName=String(result.name).split(".")
        if(splitName[splitName.length-1]==="pdf"){
            var file = fs.readFileSync( __dirname + "/" + "houses.json", 'utf8')
            var certificate = JSON.parse(file)
            if (certificate.hasOwnProperty(String(result.name)) && connected.inspector.includes(String(result.key))){
                certificate[String(result.name)].inspected = true
                StringifiedCertificate=JSON.stringify(certificate)
                fs.writeFileSync( __dirname + "/" + "houses.json", StringifiedCertificate, 'utf8')
                res.status(statusSuccess)
            } else {
                res.status(statusError)
            }
        }
        else{
            res.status(statusError)
        }
        res.end()
    });
})

app.post('/upload', function(req, res){
    console.log("upload")
    var body = '';
    req.on('data', function(data){
        body += data;
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) { 
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            req.connection.destroy();
        }
    });
    req.on('end', function () {
        result=JSON.parse(body)
        splitName=String(result.name).split(".")
        if(splitName[splitName.length-1]==="pdf" && connected.owner.includes(String(result.key))){
            fs.writeFileSync( __dirname +"/logo/"+ result.name, result.data, 'base64');
            var file = fs.readFileSync( __dirname + "/" + "houses.json", 'utf8')
            var certificate = JSON.parse(file)
            certificate[String(result.name)]={
                uri: String(result.name),
                inspected: false
            }
            StringifiedCertificate=JSON.stringify(certificate)
            fs.writeFileSync( __dirname + "/" + "houses.json", StringifiedCertificate, 'utf8')
            res.status(statusSuccess)
        }
        else{
            res.status(statusError)
        }
        res.end()
    });
})

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})