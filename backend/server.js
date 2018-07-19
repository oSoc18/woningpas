var express = require('express');
var fs = require("fs");
var qs = require('querystring');
var uuid = require("uuid/v4");
var bodyParser = require('body-parser');
var crypto = require('crypto');
var smartcontract = require('./smartcontract/smartcontract.js')
var api = require('./api.js').api;
var apiFunctions = {};

function hashh(base64content) {
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
    for (let type of Object.keys(keys)) {
        if (keys[type][key]) {
            return type;
        }
    }
    return null;
}

let mapping_key_ethereum = {}
let mapping_key_house = {}
let mapping_house_files = {}

function get_ethereum_key(key) {
    return mapping_key_ethereum[key].privateKey
}

function get_database() {
    let database_file = fs.readFileSync("./database.json")
    let database = JSON.parse(database_file)
    return database;
}

function create_key(account, password) {
    let key = undefined
    let database = get_database();
    if (database[account]) {
        key = uuid()
        keys[database[account].type][key] = true;
        mapping_key_ethereum[key] = database[account].ethereum
    }
    return key
}


function error(response, message) {
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

apiFunctions.login = function(req, res, data) {
    let key = create_key(data.account)
    if (key === undefined) {
        return error(res, "Account invalid")
    }
    success(res, {
        "key": key,
        "type": get_type(key)
    });
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
    app.post('/' + uri, function(req, res) {
        console.log(uri);
        let params = api[uri];
        let err = false;
        params.forEach(function(param) {
            if (!req.body[param]) {
                err = true;
                error(res, "Parameter " + param + " is mandatory");
            }
        })
        if (!err) {
            apiFunctions[uri](req, res, req.body);
        }
    })
});

function authorized_file(name) {
    let i = name.lastIndexOf('.')
    if (i === -1) {
        // no extension
        return false;
    }
    let ext = name.substr(i + 1)
    return ext.toLocaleLowerCase() === 'pdf'
}

apiFunctions.upload = function(req, res, data) {
    console.log("upload")

    let key = data.key
    let content = data.content
    let houseId = data.houseId;

    if (get_type(key) !== "owner") {
        return error(res, "Only owner can upload file");
    }

    let id = uuid();
    let hash = hashh(content);

    // TODO check if file exists and error
    fs.writeFileSync(UPLOAD_DIR + id, content, 'base64');
    console.log("file saved with id " + id);

    // TODO check error
    smartcontract.addUpload(hash, get_ethereum_key(key), id, houseId, res, error, success);
    console.log("called smartcontract");

    success(res, {
        "url": id
    });
}

apiFunctions.download = function(req, res, data) {
    console.log("download")
    var url = data.url
    var key = data.key

    if (get_type(key) !== "inspector") {
        return error(res, "Only inspector can download files");
    }

    // TODO check error
    let content = fs.readFileSync(UPLOAD_DIR + url, 'base64');
    if (!content) {
        // already checked by smartcontract, should exists
        return error(res, "No file with this name");
    }

    success(res, {
        "content": content
    });
}

apiFunctions.validate = function(req, res, data) {
    console.log("validate")

    let key = data.key
    let url = data.url
    let houseId = data.houseId;

    if (get_type(key) !== "inspector") {
        return error(res, "Only inspector can validate files");
    }

    // TODO check error
    smartcontract.setVerification(url, houseId, get_ethereum_key(key), res, error, success);
    console.log('called smartcontract');
}

apiFunctions.validated = function(req, res, data) {
    console.log("validated")

    let key = data.key
    let url = data.url
    let houseId = data.houseId;
    let type = get_type(key)

    if (type !== "inspector" && type !== "inspector") {
        return error(res, "Only owner and inspector see validation status");
    }

    let db = get_database();

    console.log('called smartcontract');

    smartcontract.isVerified(url, houseId, get_ethereum_key(key), res, error, success);
}


apiFunctions.getHouses = function(req, res, data) {
    let key = data.key;
    var houses = {};

    smartcontract.getNbHouses(res, error, get_ethereum_key(key), function(number) {
        let index = 0;
        for (var i = 1; i <= number; i++) {
            smartcontract.getHouse(i, get_ethereum_key(key), function(result) {
                console.log(index);
                houses[index] = result;
                console.log(houses);
                index++;

                if (index == number) {
                    success(res, {
                        "result": houses
                    });
                }

            });
        }
    });

}

apiFunctions.addHouse = function(req, res, data) {
    let key = data.key;
    let street = data.street;
    let zipCode = data.zipCode;
    let city = data.city;
    let country = data.country;
    let houseId = uuid();


    if (get_type(key) !== "owner") {
        return error(res, "Only owner can add houses");
    }

    smartcontract.addHouse(street, zipCode, city, country, houseId, get_ethereum_key(key), res, error, success)

}


apiFunctions.addDocument = function(req, res, data) {
    let key = data.key;
    let houseId = data.houseId;
    let content = data.content;

    let fileId = uuid();
    let hash = hashh(content);


    if (get_type(key) !== "owner") {
        return error(res, "Only owner can add houses");
    }

    fs.writeFileSync(UPLOAD_DIR + fileId, content, 'base64');

    smartcontract.addDocument(hash, get_ethereum_key(key), fileId, houseId, res, error, success)

}


apiFunctions.getDocuments = function(req, res, data) {
    let key = data.key;
    let houseId = data.houseId;
    var documents = {};

    smartcontract.getNbDoc(res, error, get_ethereum_key(key), houseId, function(number) {
        console.log(number);
        let index = 0;
        for (var i = 1; i <= number; i++) {
            smartcontract.getDocument(i, get_ethereum_key(key), houseId, function(result) {
                console.log(index);
                documents[index] = result;
                console.log(documents);
                index++;

                if (index == number) {
                    success(res, {
                        "result": documents
                    });

                }


            });
        }
        if (number == 0) {
            error(res, {
                "result": "No documents for this house"
            });
        }

    });

}



var server = app.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})
