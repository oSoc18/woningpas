var fs = require('fs')

function hashing(file){
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(file);
    return hash.digest('base64');
}

var file = data=fs.readFileSync( __dirname + "/" + "pdf-sample.pdf", 'base64')
console.log(hashing(file))