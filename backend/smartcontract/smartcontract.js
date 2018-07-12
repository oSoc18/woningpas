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

const addressContract = '0x20128b1e2970df825097786de02260b4e96becf2';

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

function isVerified(hash) {
  var ret = getContract();
  console.log("isVerified");
  ret.methods.isVerified(hash).call({
    from: addressContract
  }).then(function(result) {
    console.log(result);

    return result;
  });

}

async function setVerification(hash) {
  var ret = getContract();
  let acc = await getAccount();
  console.log("setVerification");
  ret.methods.setVerification(hash).send({
    from: acc
  }).then(function(result) {
    console.log(result);

    return isVerified(hash);
  });

}

async function addUpload(hash, file) {
  let acc = await getAccount();

  var ret = getContract();
  console.log("addUpload");
  ret.methods.addUpload(hash, file).send({
    from: acc
  }).then(function(result) {
    console.log(result);

    return getUpload(hash);
  });
}

function getUpload(hash) {
  var ret = getContract();
  console.log("getUpload");
  ret.methods.getFileName(hash).call({
    from: addressContract
  }).then(function(result) {
    console.log(result);

    return result;
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
