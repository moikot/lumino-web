var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var connections = require('./routes/connections'); 

var app = express(); 

var dbName = 'mydb';
var connectionString = 'mongodb://localhost:27017/' + dbName;

mongoose.connect(connectionString);

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api', connections); //This is our route middleware
app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});