'use strict';

const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

const dir = __dirname;

var fields = ["id", "isVerified", "hash", "addedAt"];
var houseFields = ["houseId", "street", "zipCode", "city", "country"];

var byteCodeContract;
let contractName = 'WoningPasV2';

const addressContract = fs.readFileSync(__dirname + '/smartcontract.address').toString()
console.log('Using contract at address "' + addressContract + '"')


//Address of the node
var url = "https://e0vp6l0egw:lt32IHCYpL4rJuBlXHFD-oCTcxABbR96Bh0qaV2FLgE@e0qztrawvi-e0q2xif8zj-rpc.eu-central-1.kaleido.io";
console.log(`1. Connecting to target node: ${url}`);
let web3 = new Web3(new Web3.providers.HttpProvider(url));

function getContract() {
  let tsSrc = fs.statSync(`${dir}/${contractName}.sol`);
  let tsBin;

  try {
    tsBin = fs.statSync(`${dir}/${contractName}.bin`);
  } catch (err) {
    console.log("Compiled contract does not exist. Will be generated.");
  }

  let compiled;
  if (!tsBin || tsSrc.mtimeMs > tsBin.mtimeMs) {
    // source file has been modified since the last compile
    let data = fs.readFileSync(`${dir}/${contractName}.sol`);
    compiled = solc.compile(data.toString(), 1);
    fs.writeFileSync(`${dir}/${contractName}.bin`, JSON.stringify(compiled));
  } else {
    compiled = JSON.parse(fs.readFileSync(`${dir}/${contractName}.bin`).toString());
  }

  let contract = compiled.contracts[`:${contractName}`];
  let abi = JSON.parse(contract.interface);
  let bytecode = '0x' + contract.bytecode;
  byteCodeContract = bytecode;

  //adresse est optionnel dans Contract
  let ret = new web3.eth.Contract(abi, addressContract);

  return ret;
}

function isVerified(fileId, houseId, privateKey, res, error, success) {
  var ret = getContract();
  console.log("isVerified");
  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);
  ret.methods.isVerified(fileId, houseId).call({
    from: acc.address,
    gas: 5e6
  }).then(function(result) {
    console.log(result);
    success(res, {
      "validated": result
    })
  }).catch(function(error) {
    console.log(error)
    error(res, "Error with isVerified")
  })
}

async function setVerification(owner, fileId, houseId, privateKey, res, error, success) {
  console.log("setVerification");
  var ret = getContract();
  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  let tx_builder = ret.methods.setVerification(owner, fileId, houseId);

  let encoded_tx = tx_builder.encodeABI();
  let transactionObject = {
    gas: 500000,
    data: encoded_tx,
    from: acc.address,
    to: addressContract
  };
  web3.eth.accounts.signTransaction(transactionObject, acc.privateKey, function(err, signedTx) {
    if (err) {
      console.log(err);
      // handle error
      error(res, "Error with setVerification")
    } else {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', function(receipt) {
          console.log(receipt);
          success(res, {
            "validated": true
          })
        });
    };
  })
}



function getUpload(fileId, houseId, callback) {
  var ret = getContract();
  console.log("getUpload");
  ret.methods.getDocument(fileId, houseId).call({
    from: addressContract
  }).then(function(result) {
    console.log(result);
    if (callback) {
      callback(result);
    }
  }).catch(function(error) {
    console.log(error)
  });
}


async function createAccount() {
  let account = await web3.eth.accounts.create();
  console.log("Create account");
  console.log(account);
  web3.eth.accounts.wallet.add(account)
  return account;
}

async function addHouse(street, zipCode, city, country, houseId, privateKey, res, error, success) {
  console.log("addHouse");
  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  var ret = getContract();

  let tx_builder = ret.methods.addHouse(street, zipCode, city, country, houseId);

  let encoded_tx = tx_builder.encodeABI();
  let transactionObject = {
    gas: 5000000,
    data: encoded_tx,
    from: acc.address,
    to: addressContract
  };
  web3.eth.accounts.signTransaction(transactionObject, acc.privateKey, function(err, signedTx) {
    if (err) {
      console.log(err);
      // handle error
      error(res, "Error with addHouse")
    } else {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', function(receipt) {
          success(res, {
            "message": "Success"
          })
        });
    };
  })
}

async function addDocument(hash, privateKey, fileId, houseId, time, res, error, success) {
  console.log("addDocument");

  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  var ret = getContract();


  let tx_builder = ret.methods.addDocument(fileId, false, hash, houseId, time);

  let encoded_tx = tx_builder.encodeABI();
  let transactionObject = {
    gas: 5000000,
    data: encoded_tx,
    from: acc.address,
    to: addressContract
  };
  web3.eth.accounts.signTransaction(transactionObject, acc.privateKey, function(err, signedTx) {
    if (err) {
      console.log(err);
      // handle error
      error(res, "Error with addDocument")
    } else {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', function(receipt) {
          success(res, {
            "id": fileId
          })
        });
    };
  })
}


async function getHouse(index, privateKey, callback) {
  var ret = getContract();
  console.log("getHouses");

  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log(index);
  ret.methods.getHouse(index).call({
    from: acc.address,
    gas: 5e6
  }).then(function(result) {
    callback(result);
  }).catch(function(error) {
    console.log(error)
    error(res, "Error with getHouses")
  })
}

async function getNbHouses(res, error, privateKey, callB) {

  var ret = getContract();
  console.log("getNbHouses");

  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  ret.methods.getHouseNumber().call({
    from: acc.address,
    gas: 5e6
  }).then(function(result) {
    callB(result);

  }).catch(function(error) {
    console.log(error)
    error(res, "Error with getNbHouses")
  })
}


async function getNbDoc(res, error, privateKey, houseId, callback) {

  var ret = getContract();
  console.log("getNbDoc");

  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  ret.methods.getDocumentNumber(houseId).call({
    from: acc.address,
    gas: 5e6
  }).then(function(result) {
    console.log(result);
    callback(result);

  }).catch(function(error) {
    console.log(error)
    error(res, "Error with getNbDoc")
  })
}


async function getDocument(index, privateKey, houseId, callback) {
  var ret = getContract();
  console.log("getDocs");

  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log(index);
  ret.methods.getDocument(houseId, index).call({
    from: acc.address,
    gas: 5e6
  }).then(function(result) {
    callback(result);
  }).catch(function(error) {
    console.log(error)
    error(res, "Error with getHouses")
  })
}

async function getHouseWithId(houseId, privateKey, res, success, error) {
  var ret = getContract();
  console.log("getHouse avec ID");

  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  console.log(houseId);
  ret.methods.getHouseWithId(houseId).call({
    from: acc.address,
    gas: 5e6
  }).then(function(result) {
    console.log("iciicic");
    console.log(result);
    if (result[0] == '') {
      error(res, "No item for this id");
    } else {
      success(res, parseResult(result, houseFields));
    }

  }).catch(function(error) {
    console.log(error)
    error(res, "Error with getHouse avec id")
  })

}


async function getDocumentWithId(owner, houseId, documentId, privateKey, res, success, error) {
  var ret = getContract();
  console.log("getDoc avec ID");

  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  ret.methods.getDocumentWithId(owner, documentId, houseId).call({
    from: acc.address,
    gas: 5e6
  }).then(function(result) {
    if (result[0] === '') {
      error(res, "No item for this id");
    } else {
      success(res, parseResult(result, fields));
    }
  }).catch(function(error) {
    console.log(error)
    error(res, "Error with getDoc avec id")
  })
}

function parseResult(data, fields) {
  let index = 0;
  var result = [];
  let prettyResult = {};

  for (var j in data) {
    prettyResult[fields[j]] = data[j];
    if (fields[j]==="addedAt"){
      prettyResult[fields[j]] = parseInt(data[j]);
    }
  }
  return prettyResult;
}

async function transfertOwnership(from, to, houseId, privateKey, res, success, error) {
  console.log("transfertOwnership");
  var ret = getContract();
  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  console.log("Addresse from to ");
  console.log(from);
  console.log(to);

  let tx_builder = ret.methods.transfertOwnership(from, to, houseId);
  let encoded_tx = tx_builder.encodeABI();

  let transactionObject = {
    gas: 5000000,
    data: encoded_tx,
    from: acc.address,
    to: addressContract
  };

  web3.eth.accounts.signTransaction(transactionObject, acc.privateKey, function(err, signedTx) {
    if (err) {
      console.log(err);
      error(res, "Error with transfertOwnership")
    } else {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', function(receipt) {
          success(res, receipt);
        });
    };
  })


}


/*Pas complet*/
function deployyy(hash, fileName) {
  var ret = getContract();

  ret = ret.deploy({
    data: byteCodeContract,
    arguments: ["hash", "fileName"]
  });

  console.log("Déploiment du contract sur le blockchain");
  console.log(ret);
}



module.exports.setVerification = setVerification;
module.exports.isVerified = isVerified;
module.exports.createAccount = createAccount;
module.exports.addHouse = addHouse;
module.exports.getHouse = getHouse;
module.exports.getNbHouses = getNbHouses;
module.exports.getDocument = getDocument;
module.exports.getNbDoc = getNbDoc;
module.exports.addDocument = addDocument;
module.exports.getHouseWithId = getHouseWithId;
module.exports.getDocumentWithId = getDocumentWithId;
module.exports.transfertOwnership = transfertOwnership;
module.exports.parseResult = parseResult;
