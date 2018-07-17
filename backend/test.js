let http = require("http");
var assert = require('assert');
let key =""

function request(cmd, data, statusCode, followingTest) {
    let reqBody = JSON.stringify(data)
    let options = {
        host: "localhost",
        port: 8080,
        path: '/' + cmd,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
  
    let req = http.request(options, function(response) {
        let body = '';
        response.on('data', function(data) {
            body += data;
        })
        response.on('end', function() {
            assert(response.statusCode===statusCode)
            followingTest(JSON.parse(body))
        })
    })
    req.write(reqBody);
    req.end();
}
function testUpload(body){
    let data ={}
    data["key"]=key
    data["content"]="test"
    request("upload", JSON.stringify(data), 400, function(){})
}
function testValidate1(body){
    console.log("Starting testValidate1")
    let data ={}
    data["key"]=key
    data["url"]="test"
    request("validate", data, 400, function(){})
}
function testValidate(body){
    console.log("Starting testValidate")
    let data ={}
    data["key"]=key
    data["url"]="cf419cd4-cdb1-4dd6-8ee5-84ecf0218f62"
    request("validate", data, 200, function(){})
}
function testNewLogin1(body){
    key=body.key
    console.log("Starting testNewLogin1")
    let data = {}
    data["account"]="accoun1"
    request("login", data, 400, testValidate)
}
function testNewLogin(body){
    console.log("Starting testNewLogin")
    let data = {}
    data["account"]="inspector"
    request("login", data, 200, testNewLogin1)
}
function testLogin1(body){
    console.log("Starting testLogin1")
    let data = {}
    data["type"]="inspector1"
    request("login", data, 400, testNewLogin)
}

function testLogin(){
    console.log("Starting testLogin")
    let data = {}
    data["type"]="inspector"
    request("login", data, 200, testLogin1)
}

testNewLogin()