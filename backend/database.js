var express = require('express');
var app = express();
var fs = require("fs");
var qs = require('querystring');
var uuid = require("uuid/v4")

var connected={
    inspector:[],
    owner:[],
    admin:[]
}

app.get('/listFiles', function (req, res) {
    fs.readFile( __dirname + "/" + "houses.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
})



app.get('/login', function(req, res){
    type = req.query.type
    if(type==="inspector" || type ==="admin" || type==="owner"){
        res.status=200
        key = uuid()
        connected[type].push(key)
        console.log(connected)
        res.write(key)
    }
    else{
        res.status=403
    }
    res.end()
})

app.post('/upload', function(req, res){
    var body = '';
    req.on('data', function (data) {
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
            fs.writeFile( __dirname + "/logo/" + result.name, result.data, 'base64', function (err) {
            });
            res.status(200)
        }
        else{
            res.status(403)
        }
        res.end()
    });
})

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})