var express = require('express');
var fs = require("fs");
var uuid = require("uuid/v4");
var bodyParser = require('body-parser');
var crypto = require('crypto');
var smartcontract = require('./smartcontract/smartcontract.js')
var api = require('./api.js').api;
var apiFunctions = {};
let db = require("./database.js");

//used to hash the content of the file, to create a fingerprint
function hashh(base64content) {
    const hash = crypto.createHash('sha256');
    var content = Buffer.from(base64content, 'base64');
    hash.update(content);
    return hash.digest('hex');
}

let MAX_FILE_SIZE = 1e6 // 1e6 === 1 * 1000000 ~~~ 1MB
let UPLOAD_DIR = __dirname + "/uploads/"
console.log("saving files in " + UPLOAD_DIR);

//Send to client an error message.
function error(response, message) {
    response.status(400);
    let data = {
        "message": message
    };
    response.json(data);
}

//Send to client the result of the request.
function success(response, data) {
    response.status(200);
    response.json(data);
}

//handle the login. Return an error message to the client in case of failure,
//and otherwise the key and type.
apiFunctions.login = function(req, res, data) {
  console.log(data.account);
  db.getAccount(data.account).then(acc => {
    let data = {
      "key": acc.email,
      "type": acc.type
    }
    success(res, data)
  }, err => {
    error(res, "No such account"+err)
  })
}

function check_type(res, key, type) {
  return new Promise(function (resolve, reject) {
    db.getAccount(key).then(acc => {
      if(acc.type == type) {
        resolve(acc)
      } else {
        error(res, "Only " + type + " can do this action")
      }
    }, err => {
      error(res, "Invalid key")
    })
  })
}

/**
 * Express routes
 */
var app = express();
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let URIs = Object.keys(api);
//Associate the various api function each with their own post request.
URIs.forEach(function(uri) {
    app.post('/api/' + uri, function(req, res) {
        console.log(uri);
        let params = api[uri];
        let err = false;
        //Check if all the parameters are valid and acts accordingly.
        params.forEach(function(param) {
            if (!req.body[param]) {
                err = true;
                error(res, "Parameter " + param + " is mandatory");
            }
        })
        if (!err) {
          if(req.body.key) {
            db.getAccount(req.body.key).then(acc => {
              req.body.acc = acc
              apiFunctions[uri](req, res, req.body);
            }, err => {
              error(res, "This account either doesn't exist or is not connected"+err)
            })
          } else {
            apiFunctions[uri](req, res, req.body);
          }
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


//Download document associated with the URL for the inspector to check.
apiFunctions.download = function(req, res, data) {
    var url = data.url
    var key = data.key

    // TODO check key
    // TODO check error
    try{
        let content = fs.readFileSync(UPLOAD_DIR + url, 'base64');
        if (!content) {
            // already checked by smartcontract, should exists
            return error(res, "No file with this name");
        }

        success(res, {
            "content": content
        });
    } catch(err){
        error(res, "No such file in the database")
    }
}

//Validate the file if the person trying to do so is an inspector.
//Require the url of the file and the id of the house the file is associated to.
apiFunctions.validate = function(req, res, data) {

    let key = data.key
    let url = data.url
    let houseId = data.houseId;
    let owner = data.owner;

    check_type(res, key, "inspector").then(acc => {
      db.getAccount(owner).then(o => {
        smartcontract.setVerification(o.ethereum.address, url, houseId, acc.ethereum.privateKey, res, error, success);
      }, err => {
        error(res, "This owner does not exists")
      })
    })
}

//Get all the houses associated to an account.
apiFunctions.getHouses = function(req, res, data) {
    let key = data.key;
    var houses = [];

    check_type(res, key, "owner").then(acc => {
      let pk = acc.ethereum.privateKey
      //Call the smart contract to get the number of houses associated with the account.
      smartcontract.getNbHouses(res, error, pk, function(number) {
          let index = 0;
          let houseFields = ["street", "zipCode", "city", "country", "houseId"];

          //Get each house one by one.
          //As it is not possible to return arrays in solidity currently.
          for (var i = 1; i <= number; i++) {
              smartcontract.getHouse(i, pk, function(result) {
                  houses.push(smartcontract.parseResult(result, houseFields));
                  index++;

                  if (index == number) {
                      success(res, houses);
                  }
              });
          }
          if (number == 0) {
              success(res, []);
          }
      });
    })
}


//Add a new house to the account.
apiFunctions.addHouse = function(req, res, data) {
    let key = data.key;
    let street = data.street;
    let zipCode = data.zipCode;
    let city = data.city;
    let country = data.country;
    let houseId = uuid();

    check_type(res, key, "owner").then(acc => {
      let pk = acc.ethereum.privateKey
      smartcontract.addHouse(street, zipCode, city, country, houseId, pk, res, error, success)
    })
}

//Add a new document to the house.
apiFunctions.addDocument = function(req, res, data) {
    let key = data.key;
    let houseId = data.houseId;
    let content = data.content;

    check_type(res, key, "owner").then(acc => {
      let pk = acc.ethereum.privateKey
      let fileId = uuid();
      let hash = hashh(content);
      let time = generateDate();

      fs.writeFileSync(UPLOAD_DIR + fileId, content, 'base64');

      smartcontract.addDocument(hash, pk, fileId, houseId, time, res, error, success)
    })
}

//Get all the documents associated with that house.
apiFunctions.getDocuments = function(req, res, data) {
    let key = data.key;
    let houseId = data.houseId;
    var documents = [];

    check_type(res, key, "owner").then(acc => {
      let pk = acc.ethereum.privateKey
      //Get each house one by one.
      //As it is not possible to return arrays in solidity currently.
      smartcontract.getNbDoc(res, error, pk, houseId, function(number) {
          let index = 0;
          let docFields = ["id", "isVerified", "hash", "addedAt"];
          //Get each house one by one.
          //As it is not possible to return arrays in solidity currently.
          for (var i = 1; i <= number; i++) {
              smartcontract.getDocument(i, pk, houseId, function(result) {
                  //Prettify the result
                  documents.push(smartcontract.parseResult(result, docFields));
                  index++;

                  if (index == number) {
                      success(res, documents);
                  }
              });
          }
          if (number == 0) {
              success(res, []);
          }

      });
    })

}

//Get the house using the id of the house.
apiFunctions.getHouse = function(req, res, data) {
    let key = data.key;
    let houseId = data.houseId;
    let owner = data.owner;

    check_type(res, key, "owner").then(acc => {
      let pk = acc.ethereum.privateKey
      smartcontract.getHouseWithId(houseId, pk, res, success, error)
    })
};

apiFunctions.getDocument = function(req, res, data) {
    let key = data.key;
    let houseId = data.houseId;
    let documentId = data.documentId;
    let owner = data.owner;

    check_type(res, key, "inspector").then(acc => {
      db.getAccount(owner).then(owner_acc => {
        let eth = owner_acc.ethereum
        smartcontract.getDocumentWithId(eth.address, houseId, documentId, eth.privateKey, res, success, error);
      }, err => {
        error(res, "This owner does not exists")
      })
    })
}

apiFunctions.transferOwnership = function(req, res, data) {
    let key = data.key;
    let mailFrom = data.from;
    let mailTo = data.to;
    let houseId = data.houseId;

    check_type(res, key, "admin").then(acc => {
      db.getAccount(mailFrom).then(from => {
        db.getAccount(mailTo).then(to => {
          smartcontract.transferOwnership(from.ethereum.address, to.ethereum.address, houseId, acc.ethereum.privateKey, res, success, error);
        })
      })
    })
}

function generateDate() {
    var today = Math.round((new Date()).getTime() / 1000);
    console.log(today);
    return String(today);
}


var server = app.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

})
