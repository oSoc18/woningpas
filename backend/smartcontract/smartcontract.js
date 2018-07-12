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

const addressContract = '0x2765eabc3ca01361d38a53efabc38f9d100a4a01';

//Address of the node
var url = "https://e0vp6l0egw:lt32IHCYpL4rJuBlXHFD-oCTcxABbR96Bh0qaV2FLgE@e0qztrawvi-e0q2xif8zj-rpc.eu-central-1.kaleido.io";

console.log(`1. Connecting to target node: ${url}`);
let web3 = new Web3(new Web3.providers.HttpProvider(url));

let contractName = 'WoningPas';

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

function isVerified(id) {
  var ret = getContract();
  console.log("isVerified");
  ret.methods.isVerified(id).call({
    from: addressContract
  }).then(function(result) {
    console.log(result);

    return result;
  });

}

async function setVerification(id) {
  var ret = getContract();
  let acc = await getAccount();
  console.log("setVerification");
  ret.methods.setVerification(id).send({
    from: acc
  }).then(function(result) {
    console.log(result);

    return isVerified(id);
  });

}

async function addUpload(hash, file, id) {
  let acc = await getAccount();

  var ret = getContract();
  console.log("addUpload");
  ret.methods.addUpload(id,file, hash).send({
    from: acc,
    gas: 5e6
  }).then(function(result) {
    console.log(result);

    return getUpload(hash);
  });
}

function getUpload(id, callback) {
  var ret = getContract();
  console.log("getUpload");
  ret.methods.getFileName(id).call({
    from: addressContract
  }).then(function(result) {
      console.log(result);
    callback(result);
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

async function getAccount() {
  let accounts = await web3.eth.personal.getAccounts();
  if (!accounts || accounts.length === 0) {
    console.error("Can't find accounts in the target node");
    process.exit(1);
  }

  return accounts[0];
}


module.exports.setVerification = setVerification;
module.exports.addUpload = addUpload;
module.exports.getUpload = getUpload;
module.exports.isVerified = isVerified;