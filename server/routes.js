var express = require('express');
var router = express.Router();

var settings = {
    name: 'Moikot 007',
    wifi_network: "AwesomeWiFi",
    wifi_password: "********",
    connected: false
};

var wifi_networks = [{
    name: "AAA",
    signal_strength: 24,
    protected: false
}, {
    name: "BBB",
    signal_strength: 26,
    protected: true
}, {
    name: "01234567890123456789012345678912",
    signal_strength: 55,
    protected: false
}, {
    name: "My WiFi",
    signal_strength: 76,
    protected: true
}];

router.route('/settings')
    .get(function(req, res) {
        res.json(settings);
    })
    .put(function(req, res) {
        settings = req.body;
        res.json({
            message: 'Settings updated'
        });
    });

router.route('/wifi_networks')
    .get(function(req, res) {
        setTimeout((function() {
            res.json(wifi_networks)
        }), 500);
    });


module.exports = router;
