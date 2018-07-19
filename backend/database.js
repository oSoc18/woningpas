let smartcontract = require("./smartcontract/smartcontract.js")
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://woningpas:woningpas1@ds219100.mlab.com:19100/woningpas"
const dbName = 'woningpas';
let client = undefined;

async function setClient(callback){
    if (client===undefined){
        MongoClient.connect(url,  { useNewUrlParser: true }, async function(err, cli){
            client=cli;
            callback()
        })
    }
}
function closeClient(){
    client.close()
}

async function getCollection(email, callback){
    if (client===undefined){
        setClient(async function(){
            const db = client.db(dbName);
            let acc=await db.collection('accounts').findOne({email:email})
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
    getCollection(email, function(acc){
        if (acc===null){
            callback(null)
        } else {
            callback(acc.type)
        }
    })
}

function getEth(email, callback){
    getCollection(email, function(acc){
        if (acc===null){
            callback(null)
        } else {
            callback(acc.ethereum)
        }
    })
}

async function createAccount(collection, email, type){
    var ethAccount = await smartcontract.createAccount();
    collection.insert({
        email:email,
        type:type,
        ethereum: ethAccount
    });
}
async function createAllAccounts(db, callback) {
    db.createCollection("accounts")
    const collection = db.collection('accounts');
    await createAccount(collection, "owner1@woningpas.be", "owner");
    await createAccount(collection, "owner2@woningpas.be", "owner");
    await createAccount(collection, "inspector1@woningpas.be", "inspector")
    callback()
}
function initDb(){
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