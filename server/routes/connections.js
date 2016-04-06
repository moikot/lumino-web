var express = require('express');
var router = express.Router();

var settings = { name: 'Moikot 007', wifi_network: "AwesomeWiFi", wifi_password: "********" };
var connection = { connected: false };

router.route('/settings')
  .get(function(req, res) {
    res.json(settings);   
  })
  .put(function(req, res) {
    settings = req.body;
    res.json({ message: 'Settings updated' });	
  });


router.route('/connection')
  .get(function(req, res) {
    res.json(connection);   
  })
  .put(function(req, res) {
    connection = req.body;
    res.json({ message: 'Connection updated' });	
  });


module.exports = router;