let smartcontract = require("./smartcontract/smartcontract.js")
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://woningpas:woningpas1@ds219100.mlab.com:19100/woningpas"
const dbName = 'woningpas';
let client = undefined;

async function setClient(callback){
    if (client===undefined){
        //singleton pattern
        MongoClient.connect(url,  { useNewUrlParser: true }, async function(err, cli){
            client=cli;
            callback()
        })
    }
}
function closeClient(){
    //need to be called before closing the server.
    client.close()
}

async function getCollection(email, callback){
    if (client===undefined){
        setClient(async function(){
            const db = client.db(dbName);
            let acc=await db.collection('accounts').findOne({email:email})
            //mongodb is asynchronous, so a callback call is needed.
            callback(acc)
        })
    }
    else{
        const db = client.db(dbName);
        let acc=await db.collection('accounts').findOne({email:email})
        callback(acc)
    }
}
function getType(email, callback){
    //get the type (owner or inspector) of the account with the associated email
    getCollection(email, function(acc){
        if (acc===null){
            callback(null)
            //send null if there is no account with this name.
        } else {
            callback(acc.type)
        }
    })
}

function getEth(email, callback){
    //get a js object with the privateKey and the address of the associated email
    getCollection(email, function(acc){
        if (acc===null){
            callback(null)
            //send null if there is no account with this name.
        } else {
            callback(acc.ethereum)
        }
    })
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
async function createAllAccounts(db, callback) {
    //create all the accounts for the db.
    //placeholder, need to be remplaced in the future with the accorect personnal info
    db.createCollection("accounts")
    const collection = db.collection('accounts');
    await createAccount(collection, "owner1@woningpas.be", "owner");
    await createAccount(collection, "owner2@woningpas.be", "owner");
    await createAccount(collection, "inspector1@woningpas.be", "inspector")
    await createAccount(collection, "admin1@woningpas.be", "admin")
    callback()
}
function initDb(){
    //init the db.
    if (client===undefined){
        setClient(function(){
            const db = client.db(dbName);
            createAllAccounts(db, function() {
                client.close();
            });
        });
    }
}
//initDb()

module.exports.initDb = initDb;
module.exports.setClient = setClient;
module.exports.getEth = getEth;
module.exports.getType = getType;
module.exports.closeClient = closeClient;