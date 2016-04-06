var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var connectionSchema = new Schema({
  deviceName: String,
  wifiConnection: String,
  wifiPassword: String
});

module.exports = mongoose.model('Connection', connectionSchema);