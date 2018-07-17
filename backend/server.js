var express = require('express');
var fs = require("fs");
var qs = require('querystring');
var uuid = require("uuid/v4");
var bodyParser = require('body-parser');
var crypto = require('crypto');
var smartcontract = require('./smartcontract/smartcontract.js')
var api = require('./api.js').api;
var apiFunctions = {};

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

let mapping_key_ethereum = {}

function get_ethereum_key(key){
    return mapping_key_ethereum[key].privateKey
}

function create_key(account, password){
    let key = undefined
    let database_file = fs.readFileSync("./database.json")
    let database = JSON.parse(database_file)
    if (database[account]){
        key = uuid()
        keys[database[account].type][key] = true;
        mapping_key_ethereum[key]=database[account].ethereum
    }
    return key
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

apiFunctions.login = function(req, res, data){
    let key = create_key(data.account)
    if (key===undefined){
        return error(res, "Account invalid")
    }
    success(res, {"key": key});
    console.log(keys);
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

let URIs = Object.keys(api);
URIs.forEach(function(uri) {
  app.post('/'+uri, function(req, res) {
    console.log(uri);
    let params = api[uri];
    let err = false;
    params.forEach(function(param) {
      if(!req.body[param]) {
        err = true;
        error(res, "Parameter " + param + " is mandatory");
      }
    })
    if(!err) {
      apiFunctions[uri](req, res, req.body);
    }
  })
});

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
    smartcontract.addUpload(h, get_ethereum_key(key), "name", id);
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
    smartcontract.setVerification(url, get_ethereum_key(key), res, error, success);
    console.log('called smartcontract');
})

app.post('/validated', function(req, res){
    console.log("validated")

    let key = req.body.key
    let url = req.body.url
    let type = get_type(key)

    if(type !== "inspector" && type !== "inspector") {
        return error(res, "Only owner and inspector see validation status");
    }

    console.log('called smartcontract');

    smartcontract.isVerified(url, get_ethereum_key(key), res, error, success);
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

async function populateDB(){
    let account = await smartcontract.createAccount();
    let accountInspector = await smartcontract.createAccount();
    var pop = {
        owner:{
            type:"owner",
            houses:{
                house1:{
                    certificate1:true,
                    certificate2:true
                },
                house2:{
                    certificate3:true
                }
            },
            ethereum:account
        },
        inspector:{
            type:"inspector",
            ethereum:accountInspector
        }
    }
    fs.writeFile("./database.json", JSON.stringify(pop))
}

//populateDB()

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})
