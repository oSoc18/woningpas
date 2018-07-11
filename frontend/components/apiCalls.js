var loginRoutine = function (type) {
  var http = require("http")
  var options = {
      host: "localhost",
      port: 8080,
      path: '/login?type='+type,
      method: 'GET'
  }
  http.request(options, function(res) {
    res.setEncoding('utf8');
    sumChunk=""
    res.on('data', function (chunk) {
      if (res.statusCode===200){
        sumChunk+=chunk
      }
    });
    res.on("end", function(){
      const key=JSON.parse(sumChunk).key
      localStorage.setItem('token', key) // store the token in localstorage
    })
  }).end()
}


module.exports = loginRoutine
