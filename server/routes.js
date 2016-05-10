var express = require('express');
var router = express.Router();

var settings = {
    name: 'Moikot 007',
    wifi_network: "AwesomeWiFi",
    wifi_password: "********",
    connected: false
};

var wifi_networks = [{"ssid": "EE-BrightBox-6374g9","rssi": -55,"encryption": "Auto"},{"ssid": "virginmedia9996303","rssi": -49,"encryption": "WPA2"},{"ssid": "BTWifi-with-FON","rssi": -68,"encryption": "None"},{"ssid": "TALKTALK-FF71AE","rssi": -87,"encryption": "Auto"},{"ssid": "HUAWEI-B593-3484","rssi": -93,"encryption": "Auto"},{"ssid": "BTHub4-NC8S","rssi": -68,"encryption": "Auto"},{"ssid": "BTWifi-X","rssi": -69,"encryption": "None"},];

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
