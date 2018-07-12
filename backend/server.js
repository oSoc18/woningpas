var express = require('express');
var fs = require("fs");
var qs = require('querystring');
var uuid = require("uuid/v4");
var bodyParser = require('body-parser');
var crypto = require('crypto');
var smartcontract = require('./smartcontract/smartcontract.js')

function hash(base64content){
    const hash = crypto.createHash('sha256');
    var content = Buffer.from(base64content, 'base64');
    hash.update(content);
    return hash.digest('hex');
}

let authorized_types = {
    "owner": true,
    "inspector": true,
    "admin": true
}
let MAX_FILE_SIZE = 1e6 // 1e6 === 1 * 1000000 ~~~ 1MB
let UPLOAD_DIR = __dirname + "/uploads/"


let keys = {}
Object.keys(authorized_types).forEach(function(type) {
    keys[type] = {}
});
console.log(keys);
console.log("saving files in " + UPLOAD_DIR);

function get_type(key) {
    for(let type of Object.keys(keys)) {
        if(keys[type][key]) {
            return type;
        }
    }
    return null;
}

function error(response, message){
    response.status(400);
    let data = {
        "message": message
    };
    response.json(data);
}

function success(response, data) {
    response.status(200);
    response.json(data);
}

/**
 * Express routes
 */
var app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/login', function(req, res){
    console.log("login")
    let type = req.body.type
    if(!type) {
        return error(res, "type parameter is mandatory");
    }

    if(!authorized_types.hasOwnProperty(type)){
        return error(res, "Unknown type");
    }

    let key = uuid()
    keys[type][key] = true;

    success(res, {"key": key});
    console.log(keys);
})

function authorized_file(name) {
    let i = name.lastIndexOf('.')
    if(i === -1) {
        // no extension
        return false;
    }
    let ext = name.substr(i + 1)
    return ext.toLocaleLowerCase() === 'pdf'
}

app.post('/upload', function(req, res){
    console.log("upload")

    let key = req.body.key
    let content = req.body.content

    if(get_type(key) !== "owner") {
        return error(res, "Only owner can upload file");
    }

    let id = uuid();
    let h = hash(content);

    // TODO check if file exists and error
    fs.writeFileSync(UPLOAD_DIR + id, content, 'base64');
    console.log("file saved with id " + id);

    // TODO check error
    smartcontract.addUpload(h, "name", id);
    console.log("called smartcontract");

    success(res, {"url": id});
})

app.post('/download', function(req, res){
    console.log("download")
    var url = req.body.url
    var key = req.body.key

    if(get_type(key) !== "inspector") {
        return error(res, "Only inspector can download files");
    }

    // TODO check error
    let content = fs.readFileSync(UPLOAD_DIR + url, 'base64');
    if(!content) {
        // already checked by smartcontract, should exists
        return error(res, "No file with this name");
    }

    success(res, {"content": content});
})

function validate(name) {
    // TODO validate
    return true;
}

app.post('/validate', function(req, res){
    console.log("validate")

    let key = req.body.key
    let url = req.body.url

    if(get_type(key) !== "inspector") {
        return error(res, "Only inspector can validate files");
    }

    // TODO check error
    smartcontract.setVerification(url);
    console.log('called smartcontract');

    success(res, {});
})

app.post('/validated', function(req, res){
    console.log("validate")

    let key = req.body.key
    let url = req.body.url
    let type = get_type(key)

    if(type !== "inspector" && type !== "inspector") {
        return error(res, "Only owner and inspector see validation status");
    }

    let checked = smartcontract.setVerification(url);

    console.log('called smartcontract');

    success(res, {"validated":smartcontract.isVerified(url)});
})

/* TODO later
app.get('/listFiles', function (req, res) {
    console.log("listing files")
    data = fs.readFileSync( __dirname + "/" + "houses.json", 'utf8')
    key=req.query.key
    if(connected.inspector.includes(key) || connected.owner.includes(key) || connected.admin.includes(key)) {
        success(res, data);
    }
    else{
        error(res, "Error listing files");
    }
})
//*/


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})
