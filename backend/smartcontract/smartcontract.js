'use strict';

const argv = require('yargs').argv;
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const solc = require('solc');
const fs = require('fs');

const dir = __dirname;
const verbose = argv.verbose;
const query = argv.query;
const deploy = argv.deploy;
const set = argv.set;
const privateFor = argv.privateFor;
const externallySign = argv.sign;

var byteCodeContract;
let contractName = 'WoningPas';


const addressContract = '0x2765eabc3ca01361d38a53efabc38f9d100a4a01';
//needs to be changed
var adresseFrom;
//Address of the node
var url = "https://e0vp6l0egw:lt32IHCYpL4rJuBlXHFD-oCTcxABbR96Bh0qaV2FLgE@e0qztrawvi-e0q2xif8zj-rpc.eu-central-1.kaleido.io";
console.log(`1. Connecting to target node: ${url}`);
let web3 = new Web3(new Web3.providers.HttpProvider(url));

var accountAddress;
//setVerification('cf419cd4-cdb1-4dd6-8ee5-84ecf0218f62');
//getAccount();
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
    success(res, {"validated":result})
  }).catch(function(error) {
    console.log(error)
    error(res, "Error with isVerified")
  })
}

async function setVerification(fileId, houseId, privateKey, res, error, success) {
  var ret = getContract();
  console.log(ret)
  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log("setVerification");
  
  let tx_builder = ret.methods.setVerification(fileId, houseId);
  let encoded_tx = tx_builder.encodeABI();
  let transactionObject = {
    gas: 50000,
    data: encoded_tx,
    from: acc.address,
    to: addressContract
  };
  web3.eth.accounts.signTransaction(transactionObject, acc.privateKey, function (err, signedTx) {
    if (err) {
      console.log(err);
      // handle error
      error(res, "Error with setVerification")
    } else {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', function (receipt) {
            success(res, success(res, {"validated":true}))
      });
    };
  })
}

async function addUpload(hash, privateKey, fileId, houseId, res, error, success) {
  let acc = web3.eth.accounts.privateKeyToAccount(privateKey);

  var ret = getContract();
  console.log("addUpload");

  let tx_builder = ret.methods.addDocument(fileId, false, hash, houseId);
  
  let encoded_tx = tx_builder.encodeABI();
  let transactionObject = {
    gas: 5000000,
    data: encoded_tx,
    from: acc.address,
    to: addressContract
  };
  web3.eth.accounts.signTransaction(transactionObject, acc.privateKey, function (err, signedTx) {
    if (err) {
      console.log(err);
      // handle error
      error(res, "Error with addUpload")
    } else {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', function (receipt) {
            success(res, success(res, {"url":id}))
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
      if(callback) {
        callback(result);
      }
  }).catch(function(error){
    console.log(error)
  });
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

async function createAccount() {
  let account = await web3.eth.accounts.create();
  console.log("Create account");
  console.log(account);
  web3.eth.accounts.wallet.add(account)
  return account;
}


module.exports.setVerification = setVerification;
module.exports.addUpload = addUpload;
module.exports.getUpload = getUpload;
module.exports.isVerified = isVerified;
module.exports.createAccount = createAccount;