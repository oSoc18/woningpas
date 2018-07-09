var http = require("http")
var options = {
    host: "localhost",
    port: 8080,
    path: '/isCorrectPassword?name=house1&password=test1',
    method: 'GET'
  };
  
  http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  }).end();