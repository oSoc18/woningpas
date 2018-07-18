let smartcontract = require("./smartcontract/smartcontract.js")
let fs = require("fs")

async function populateDB() {
    let account1 = await smartcontract.createAccount();
    let account2 = await smartcontract.createAccount();
    let accountInspector = await smartcontract.createAccount();
    var pop = {
        "owner1@woningpas.be": {
            type: "owner",
            houses: {
                house1_id: {
                    
                    certificate1: true,
                    certificate2: true
                },
                house2_id: {
                    certificate3: true
                }
            },
            ethereum: account1
        },
        "owner2@woningpas.be": {
            type: "owner",
            houses: {
                house1_id: {
                    certificate1: true,
                    certificate2: true
                }
            },
            ethereum: account2
        },
        "inspector1@woningpas.be": {
            type: "inspector",
            ethereum: accountInspector
        }
    }
    fs.writeFile("./database.json", JSON.stringify(pop))
}

populateDB()