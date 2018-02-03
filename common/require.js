var http = require('http');
var querystring = require('queryString');

function httpRequired(hostname, requiredParams) {
  var params = Object.assign(requiredParams, { hostname:hostname });
  var promise = new Promise(function(resolve, reject) {
    var chunks = '';
    var req = http.request(params, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        chunks.push(chunk);
      });
      res.on('end', function() {
        resolve(chunks.slice());
      });
    });

    if(params.method === 'POST') {
      req.write(params.data);
      req.end;
    }

    req.on('error', function(e) {
      reject(e);
    });
  });

  return promise.then(function(reqponse) {
    return JSON.parse(reqponse);
  }).catch(function(e) {
    console.log(e);
  });
}

module.exports = {
 httpRequired : httpRequired
};