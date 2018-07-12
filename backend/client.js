var http = require("http")

path = {
  "login": ["type"],
  "upload": ["key", "content"],
  "download": ["key", "url"],
  "validate": ["key", "url"],
  "validated": ["key", "url"],
}

function usage(command, error) {
  if(error) {
    console.log('ERROR: ' + error);
  }

  if(!command || !path.hasOwnProperty(command)) {
    return console.log("Available commands:\n\t"+Object.keys(path));
  }

  return console.log("Required parameters:\n\t" + path[command]);
}

function command() {
  let args = process.argv;
  let len = args.length;

  if(len < 3) {
    return usage(null, "No command.");
  }

  let cmd = args[2];
  if(!path.hasOwnProperty(cmd)) {
    return usage(null, "Invalid command.");
  }

  let params = path[cmd];
  if(len != params.length + 3) {
    return usage(cmd, "Invalid number of parameters.");
  }

  let data = {};
  for(let i = 0; i < params.length; i++) {
    let name = params[i];
    let value = args[i+3];
    data[name] = value;
  }

  request(cmd, JSON.stringify(data));
}

function request(cmd, data) {
  let options = {
    host: "localhost",
    port: 8080,
    path: '/' + cmd,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  console.log('');
  console.log(options.method + ' ' + 'http://' + options.host + ':' + options.port + options.path);
  console.log('--- REQ DATA ---');
  console.log(data);

  let req = http.request(options, function(response) {
    let body = '';
    response.on('data', function(data) {
      body += data;
    })
    response.on('end', function() {
      console.log('STATUS: ' + response.statusCode);
      console.log('--- RES DATA ---');
      console.log(body);
    })
  })
  req.write(data);
  req.end();
}

command();
