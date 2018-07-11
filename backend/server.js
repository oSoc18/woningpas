var express = require('express');
var fs = require("fs");
var qs = require('querystring');
var uuid = require("uuid/v4");
var bodyParser = require('body-parser');


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

app.get('/login', function(req, res){
    console.log("login")
    let type = req.query.type
    if(!type) {
        return error(res, "type parameter is mandatory");
    }
    
    if(!authorized_types.hasOwnProperty(type)){
        return error(res, "Unknown type");
    }
    
    key = uuid()
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

function save_file(name, content) {
    // TODO check if file exists
    fs.writeFileSync(UPLOAD_DIR + name, content, 'base64');
    // TODO call blockchain API to save file hash
    console.log("file saved");
    // TODO check error
    return true;
}

function load_file(name) {
    let content = fs.readFileSync(UPLOAD_DIR + name, 'base64');
    // TODO check error
    return content;
}

app.post('/upload', function(req, res){
    console.log("upload")

    let data = req.body
    if(!authorized_file(data["name"])) {
        return error(res, "Unauthorized file type");
    }
    
    if(get_type(data["key"]) !== "owner") {
        return error(res, "Only owner can upload file");
    }
    
    if(!save_file(data["name"], data["content"])) {
        return error(res, "Error saving file");
    }
    
    success(res, {"URL": data["name"]});
})

app.get('/download', function(req, res){
    console.log("download")
    var name = req.query.name
    var key = req.query.key
    
    if(get_type(key) !== "inspector") {
        return error(res, "Only inspector can download files");
    }
    
    let content = load_file(name);
    if(!content) {
        return error(res, "No file with this name");
    }
    
    let data = {
        "name": name,
        "content": content
    }
    success(res, data);
})

function validate(name) {
    // TODO validate
    return true;
}

app.post('/validate', function(req, res){
    console.log("validate")

    let data = req.body
    let key = data["key"]
    let name = data["name"]
    
    if(get_type(key) !== "inspector") {
        return error(res, "Only inspector can validate files");
    }
    
    if(!validate(name)) {
        return error(res, "Error validating file");
    }
    
    success(res, {});
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
