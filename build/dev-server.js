require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var http = require('http');
var WebSocket = require('ws');
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
    hotMiddleware.publish({
      action: 'reload'
    })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options
    }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function() {
  console.log('> Listening at ' + uri + '\n')
})

const server = http.createServer(app);
const wss = new WebSocket.Server({
  server
});

const ssids = [
  "BTHub5-GN2P-A", "ABRAGN2P-A", "BTwifi-FONDA", "MNBA_AMA_179872498",
  "BTHub5-GN2P-4", "VM05678011", "VirginMediaASC-021", "Ama ENVY 1120",
  "Really long wifi name 123456789"
];

const rssis = [-25, -50, -75, -99];

const encryptions = [
  'WEP', 'WPA/PSK', 'WPA2/PSK', 'WPA/WPA2/PSK', 'none', 'unknown'
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

function generateNetworks() {
  var networks = [];
  for (i = 0; i < 9; i++) {
    var network = {
      ssid: ssids[i],
      rssi: rssis[getRandomInt(0, rssis.length)],
      encryption: encryptions[getRandomInt(0, encryptions.length)]
    };
    networks.push(network);
  }
  return {
    _type: "event",
    resource: "networks",
    eventType: "scanned",
    content: {
      _type: "networks",
      elements: networks
    }
  }
};

function generateConnection(ssid) {
  return {
    _type: "connection",
    ssid: ssid,
    isConnected: true,
    isProtected: true,
    rssi: -50,
    localIP: '121.122.22.111',
    subnetMask: '121.122.22.112',
    gatewayIP: '121.122.22.113',
    dnsIP: '121.122.22.114',
    disconnectReason: 201
  }
}

function generateSettings() {
  return {
    _type: "settings",
    uniqueName: "LUMINO_01SA"
  }
}

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws, req) {
  ws.on('message', function incoming(message) {
    var message = JSON.parse(message);
    if (message._type === 'request' &&
      message.resource === 'networks' &&
      message.requestType === 'scan') {
      setTimeout(function() {
        wss.broadcast(JSON.stringify(generateNetworks()));
      }, 2000);
    }
    if (message._type === 'request' &&
      message.resource === 'settings' &&
      message.requestType === 'read') {
      setTimeout(function() {
        wss.broadcast(JSON.stringify({
          _type: 'response',
          resource: 'settings',
          requestType: 'read',
          content: generateSettings()
        }));
      }, 100);
    }
    if (message._type === 'request' &&
      message.resource === 'connection' &&
      message.requestType === 'read') {
      setTimeout(function() {
        wss.broadcast(JSON.stringify({
          _type: 'response',
          resource: 'connection',
          requestType: 'read',
          content: generateConnection('test')
        }));
      }, 100);
    }
    if (message._type === 'request' &&
      message.resource === 'connection' &&
      message.requestType === 'create') {
      setTimeout(function() {
        wss.broadcast(JSON.stringify({
          _type: 'event',
          resource: 'connection',
          eventType: 'created',
          content: generateConnection(message.content.ssid)
        }));
      }, 500);
    }
    if (message._type === 'request' &&
      message.resource === 'connection' &&
      message.requestType === 'delete') {
      wss.broadcast(JSON.stringify({
        _type: 'event',
        resource: 'connection',
        eventType: 'deleted'
      }))
    }
  });
});

module.exports = server.listen(port, function(err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
