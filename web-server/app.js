var express = require('express');
var serveIndex = require('serve-index');

var app = express();

app.use('/', serveIndex('public'));
app.use('/', express.static('public'));

var server = app.listen(3636, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('web server listening at http://%s:%s', host, port);
});
