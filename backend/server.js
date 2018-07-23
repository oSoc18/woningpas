var express = require('express');
var fs = require("fs");
var qs = require('querystring');
var uuid = require("uuid/v4");
var bodyParser = require('body-parser');
var crypto = require('crypto');
var smartcontract = require('./smartcontract/smartcontract.js')
var api = require('./api.js').api;
var apiFunctions = {};
let db = require("./database.js");

generateDate();
function hashh(base64content) {
    //used to hash the content of the file, to be allowed to check its veracity.
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

function exist_key(key) {
    for (let type of Object.keys(keys)) {
        if (keys[type][key]) {
            return true;
        }
    }
    return false; 
}
function get_type(key) {
    //Get the type of the identification token (owner, inspector or admin)
    for (let type of Object.keys(keys)) {
        if (keys[type][key]) {
            return type;
        }
    }
    return null;
}

let mapping_key_ethereum = {}

function get_ethereum_key(key) {
    //get the web3 private key associated with the email account, using the identification token.
    return mapping_key_ethereum[key].privateKey
}

function create_key(account, callback) {
    //initialise the mappings using the mongoDB database.
    db.getType(account, function(res) {
        if (res != null) {
            keys[res][account] = true;
            db.getEth(account, function(eth) {
                mapping_key_ethereum[account] = eth
                callback(account)
            })
        } else {
            console.log("Couldn't find account")
            callback(undefined)
        }
    })
}


function error(response, message) {
    //Send to client an error message.
    response.status(400);
    let data = {
        "message": message
    };
    response.json(data);
}

function success(response, data) {
    //Send to client the result of the request.
    response.status(200);
    response.json(data);
}

apiFunctions.login = function(req, res, data) {
    //handle the login. Return an error message to the client in case of failure,
    //and otherwise the key and type.
    create_key(data.account, function(key) {
        if (key === undefined) {
            return error(res, "No such account")
        }
        success(res, {
            "key": key,
            "type": get_type(key)
        });

    })
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
    //Associate the various api function each with their own post request.
    app.post('/' + uri, function(req, res) {
        console.log(uri);
        let params = api[uri];
        let err = false;
        params.forEach(function(param) {
            //Check if all the parameters are valid and acts accordingly.
            if (!req.body[param]) {
                err = true;
                error(res, "Parameter " + param + " is mandatory");
            }
        })
        if (uri!="login" && !err){
            if (!exist_key(req.body["key"])){
                err = true
                error(res, "This account either doesn't exist or is not connected")
            }
        }
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

    console.log('called smartcontract');

    smartcontract.isVerified(url, houseId, get_ethereum_key(key), res, error, success);
}


apiFunctions.getHouses = function(req, res, data) {
    let key = data.key;
    var houses = [];

    smartcontract.getNbHouses(res, error, get_ethereum_key(key), function(number) {
        let index = 0;
        let houseFields = ["street", "zipCode", "city", "country", "houseId"];

        for (var i = 1; i <= number; i++) {
            smartcontract.getHouse(i, get_ethereum_key(key), function(result) {
                console.log(index);
                prettyResult = {}
                for (j in result) {
                    prettyResult[houseFields[j]] = result[j];


                }
                houses.push(prettyResult);
                console.log(prettyResult);
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

    if (get_type(key) !== "owner") {
        return error(res, "Only owner can add houses");
    }

    let fileId = uuid();
    let hash = hashh(content);
    let time = generateDate();


    fs.writeFileSync(UPLOAD_DIR + fileId, content, 'base64');

    smartcontract.addDocument(hash, get_ethereum_key(key), fileId, houseId, time, res, error, success)
    success(res, {
        "url": fileId
    });

}

apiFunctions.getDocuments = function(req, res, data) {
    let key = data.key;
    let houseId = data.houseId;
    var documents = [];

    smartcontract.getNbDoc(res, error, get_ethereum_key(key), houseId, function(number) {
        console.log(number);
        let index = 0;
        let docFields = ["fileId", "isVerified", "hash", "addedAt"];
        
        for (var i = 1; i <= number; i++) {
            smartcontract.getDocument(i, get_ethereum_key(key), houseId, function(result) {
                console.log(index);
                let prettyResult = {};
                for (j in result) {
                    prettyResult[docFields[j]] = result[j];
                }
                documents.push(prettyResult);
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
            success(res, "No documents for this house");
        }

    });

}

function generateDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var minute = today.getMinutes();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    var millisecond = today.getMilliseconds();


    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '/' + mm + '/' + yyyy + " " + hour + ":" + minute + ":"+ second +":" +millisecond;

    console.log(today);
    return today;
}


var server = app.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})