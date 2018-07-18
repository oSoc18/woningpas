let http = require("http");
var assert = require('assert');
let key =""
let url = ""
let fs = require("fs")

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
            console.log(body)
            assert(response.statusCode===statusCode)
            followingTest(JSON.parse(body))
        })
    })
    req.write(reqBody);
    req.end();
}
function testUpload(body){
    key=body.key
    console.log("Starting testUpload")
    let data ={}
    data["key"]=key
    data["content"]=fs.readFileSync("./pdf-sample.pdf")
    request("upload",data, 200, testLoginUpload)
}
function testLoginUpload(body){
    url = body.url
    console.log("Starting testLoginUpload")
    let data = {}
    data["account"]="inspector"
    request("login", data, 200, testValidated1)
}
function testValidated(body){
    console.log("Starting testValidated")
    let data={}
    data["key"]=key
    data["url"]=url
    request("validated", data, 200, function(){})
}
function testValidated1(body){
    key=body.key
    console.log("Starting testValidated")
    let data={}
    data["key"]=key
    data["url"]=url
    request("validated", data, 200, testValidate)
}
function testValidate(body){
    console.log("Starting testValidate")
    let data ={}
    data["key"]=key
    data["url"]=url
    request("validate", data, 200, testValidated)
}
function testNewLogin1(body){
    console.log("Starting testNewLogin1")
    let data = {}
    data["account"]="accoun1"
    request("login", data, 400, testValidate)
}
function testNewLogin(body){
    console.log("Starting testNewLogin")
    let data = {}
    data["account"]="owner"
    request("login", data, 200, testUpload)
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
    data["type"]="owner"
    request("login", data, 200, testLogin1)
}

testNewLogin()