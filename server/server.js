var express = require('express');
var bodyParser = require('body-parser');
var connections = require('./routes'); 

var app = express(); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api', connections); 
app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});