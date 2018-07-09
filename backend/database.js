var express = require('express');
var app = express();
var fs = require("fs");
var qs = require('querystring');

app.get('/listHouses', function (req, res) {
    fs.readFile( __dirname + "/" + "houses.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
})

app.get('/isCorrectPassword', function(req, res){
    name = req.query.name
    password = req.query.password
    fs.readFile( __dirname + "/" + "houses.json", 'utf8', function (err, data) {
        file = JSON.parse(data)
        if(file[name].password === password){
            res.status(200)
        }
        else{
            res.status(203)
        }
    });
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
        fs.writeFile( __dirname + "/logo/" + result.name+"."+result.extension, result.data, 'utf8', function (err) {
        });
    });
    res.end()
})

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})