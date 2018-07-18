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
function testValidated(body){
    console.log("Starting testValidated")
    let data={}
    data["key"]=key
    data["url"]=url
    request("validated", data, 200, function(){})
}
function testValidate(body){
    console.log("Starting testValidate")
    let data ={}
    data["key"]=key
    data["url"]=url
    request("validate", data, 200, testValidated)
}
function testValidated1(body){
    key=body.key
    console.log("Starting testValidated1")
    let data={}
    data["key"]=key
    data["url"]=url
    request("validated", data, 200, testValidate)
}
function testLoginUpload(body){
    url = body.url
    console.log("Starting testLoginUpload")
    let data = {}
    data["account"]="inspector"
    request("login", data, 200, testValidated1)
}
function testUpload(body){
    key=body.key
    console.log("Starting testUpload")
    let data ={}
    data["key"]=key
    data["content"]=fs.readFileSync("./pdf-sample.pdf")
    request("upload",data, 200, testLoginUpload)
}
function testNewLogin(body){
    console.log("Starting testNewLogin")
    let data = {}
    data["account"]="owner"
    request("login", data, 200, testUpload)
}

testNewLogin()