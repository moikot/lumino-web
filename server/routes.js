var express = require('express');
var router = express.Router();

var settings = { name: 'Moikot 007', wifi_network: "AwesomeWiFi", wifi_password: "********" };
var connection = { connected: false };
var wifi_networks = [{name: "AAA", signal_strength: 24}, {name: "BBB", signal_strength: 26}, {name: "CCC", signal_strength: 55}, {name: "My WiFi", signal_strength: 76}];

router.route('/settings')
  .get(function (req, res) {
    res.json(settings);
  })
  .put(function (req, res) {
    settings = req.body;
    res.json({ message: 'Settings updated' });
  });

router.route('/wifi_networks')
  .get(function(req, res) {
    setTimeout((function() {res.json(wifi_networks)}), 5000);
});

router.route('/connection')
  .get(function (req, res) {
    res.json(connection);
  })
  .put(function (req, res) {
    connection = req.body;
    res.json({ message: 'Connection updated' });
  });


module.exports = router;