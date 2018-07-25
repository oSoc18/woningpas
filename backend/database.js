let smartcontract = require("./smartcontract/smartcontract.js")

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://woningpas:woningpas1@ds219100.mlab.com:19100/woningpas"
const dbName = 'woningpas';

let client = null;

async function getDatabase() {
  if(!client || !client.isConnected()) {
    client = await MongoClient.connect(url,  { useNewUrlParser: true })
  }
  return client.db(dbName)
}

async function getCollection(name) {
  let db = await getDatabase()
  return await db.collection(name)
}

function closeClient(){
    if(client && client.isConnected()) {
      client.close()
    }
}

async function getAccount(email){
  let col = await getCollection('accounts')
  return col.findOne({email:email})
}

async function getType(email){
  return await getAccount(email).type
}

async function getEth(email){
  return await getAccount(email).ethereum
}

async function createAccount(collection, email, type){
    //create a document for that account.
    var ethAccount = await smartcontract.createAccount();
    //create an web3 account
    collection.insert({
        email:email,
        type:type,
        ethereum: ethAccount
    });
}

async function createAllAccounts(collection, success) {
    //create all the accounts for the db.
    //placeholder, need to be remplaced in the future with the correct personnal info
    await createAccount(collection, "owner1@woningpas.be", "owner");
    await createAccount(collection, "owner2@woningpas.be", "owner");
    await createAccount(collection, "inspector1@woningpas.be", "inspector")
    await createAccount(collection, "admin1@woningpas.be", "admin")
    success()
}

async function init(){
  let db = await getDatabase();
  db.createCollection('accounts').then(collection => {
    createAllAccounts(collection, function() {
      console.log('accounts created')
    })
  })
}

//init()

module.exports.init = init;
module.exports.getAccount = getAccount;
module.exports.getType = getType;
module.exports.getEth = getEth;
module.exports.closeClient = closeClient;
