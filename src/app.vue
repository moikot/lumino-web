<template>
<!-- App -->
<div id="app">
  <!-- Main Views -->
  <f7-views>
    <f7-view id="main-view" navbar-through :dynamic-navbar="true" main>
      <!-- iOS Theme Navbar -->
      <f7-navbar v-if="$theme.ios">
        <f7-nav-center sliding>{{ device }}</f7-nav-center>
      </f7-navbar>
      <!-- Pages -->
      <f7-pages>
        <f7-page>
          <!-- Material Theme Navbar -->
          <f7-navbar v-if="$theme.material">
            <f7-nav-center sliding>Framework7</f7-nav-center>
          </f7-navbar>
          <div v-if="connection !== null">
            <f7-block-title>
              CONNECTION
            </f7-block-title>
            <f7-list class="wifi-list">
              <li>
                <a href="/connection/" class="item-link">
                  <network :network="connection">
                  </network>
                </a>
              </li>
              <div v-if="error" class="list-block-label connection-error">
                Connection error: {{ error }}
              </div>
            </f7-list>
          </div>
          <f7-block-title>
            CHOOSE A NETWORK...
            <div v-if="isRefreshing" style="display:inline-block">
              <i class="icon title-icon icon-arrows-cw animate-spin"></i>
            </div>
          </f7-block-title>
          <f7-list class="wifi-list">
            <li v-for="network in networks" v-bind:data="network">
              <a href="/connect/" class="item-link" v-on:click="networkSelected(network)">
                <network :network="network">
                </network>
              </a>
            </li>
            <li>
              <a href="/connect/" class="item-link" v-on:click="networkSelected(null)">
                <div class="item-content">
                  <div class="item-media">
                    <i class="icon icon-none"></i>
                  </div>
                  <div class="item-inner">
                    <div class="other">
                      <span>Other...</span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </f7-list>
        </f7-page>
      </f7-pages>
    </f7-view>
  </f7-views>
</div>
</template>

<script>
import network from './components/network.vue'
import state from './state.js'

export default {
  components: {
    network
  },
  data() {
    return state
  },
  created() {
    const self = this;
    this.ws = new WebSocket('ws://' + window.location.host + '/ws');
    //this.ws = new WebSocket('ws://192.168.4.1/ws');
    this.ws.addEventListener('open', function() {
      self.getSettings()
      self.getConnection();
      self.refreshNetworks();
    });
    this.ws.addEventListener('message', function(e) {
      var json = JSON.parse(e.data)
      if (json._type == "response") {
        if (json.resource == "connection" &&
          json.requestType == "read" &&
          json.content._type == "connection") {
          self.updateConnection(json.content)
        }
        if (json.resource == "settings" &&
          json.requestType == "read" &&
          json.content._type == "settings") {
          self.updateSettings(json.content)
        }
      } else if (json._type == "event") {
        if (json.resource == "networks" &&
          json.eventType == "scanned" &&
          json.content._type == "networks") {
          self.updateNetworks(json.content)
        }
        if (json.resource == "connection" &&
          json.eventType == "created" &&
          json.content._type == "connection") {
          self.updateConnection(json.content)
        }
        if (json.resource == "connection" &&
          json.eventType == "deleted") {
          self.deleteConnection()
        }
        if (json.resource == "connection" &&
          json.eventType == "updated" &&
          json.content._type == "connection") {
          self.updateConnection(json.content)
        }
      }
    });
  },
  methods: {

    networkSelected: function(network) {
      this.selectedNetwork = {
        "network": network,
        "ssid": network ? network.ssid : "",
        "encryption": network ? network.encryption : "",
        "password": ""
      }
    },

    getSettings: function() {
      this.ws.send(
        JSON.stringify({
          _type: "request",
          id: "id",
          requestType: "read",
          resource: "settings"
        }));
    },

    updateSettings: function(settings) {
      this.device = settings.uniqueName;
    },

    getConnection: function() {
      this.ws.send(
        JSON.stringify({
          _type: "request",
          id: "id",
          requestType: "read",
          resource: "connection"
        }));
    },

    getNetworkByRssi: function(ssid) {
      for (var i = 0, j = this.networks.length; i < j; i++) {
        if (this.networks[i].ssid === ssid) {
          return this.networks[i];
        }
      }
      return null;
    },

    getError: function(connection) {
      switch (connection.disconnectReason) {
        case 8:
          return ''; // Disconnected
        case 201:
          return "network \"" + connection.ssid + "\" is not found";
        case 2:
        case 202:
          return "invalid password";
        case 203:
          return "association failed";
        case 15:
        case 204:
          return "handshake timeout";
      }
      return "unknown (" + connection.disconnectReason + ")";
    },

    updateConnection: function(connection) {
      connection.state = connection.isConnected ? 'connected' : 'connecting';
      const network = this.getNetworkByRssi(connection.ssid);
      if (network !== null) {
        connection.encryption = network.encryption;
        connection.rssi = network.rssi;
      } else {
        connection.encryption = connection.isProtected ? 'unknown' : 'none';
        connection.rssi = this.getRssiStrength(connection.rssi);
      }
      this.connection = connection
      if (connection.isConnected || connection.disconnectReason == 0) {
        this.error = '';
      } else {
        this.error = this.getError(connection);
      }
    },

    deleteConnection: function() {
      this.connection = null;
      this.error = null;
    },

    updateNetworks: function(networks) {
      const self = this;
      networks = networks.elements.sort(function(a, b) {
        return b.rssi - a.rssi;
      })
      networks.forEach(function(network) {
        network.state = 'none';
        network.rssi = self.getRssiStrength(network.rssi);
      });
      this.networks = networks;
      this.networksRefreshed();
    },

    getRssiStrength: function(rssi) {
      var strength = 1;
      if (rssi > -70)
        strength = 2;
      if (rssi > -60)
        strength = 3;
      if (rssi > -50)
        strength = 4;
      return strength;
    },

    refreshNetworks: function() {
      const self = this;
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.ws.send(
          JSON.stringify({
            _type: "request",
            id: "id",
            requestType: "scan",
            resource: "networks"
          }));
        setTimeout(function() {
          self.networksRefreshed();
        }, 10000);
      }
    },

    networksRefreshed: function() {
      const self = this;
      if (this.isRefreshing) {
        this.isRefreshing = false;
        setTimeout(function() {
          self.refreshNetworks();
        }, 8000);
      }
    }
  }
}
</script>
