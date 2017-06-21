<template>
<f7-page v-on:page:afterback="aferBack()" v-on:page:init="setDisconnect(false)">
  <f7-navbar :title="connection.ssid" back-link="Back" sliding>
  </f7-navbar>
  <f7-block-title>
    IP ADDRESS
  </f7-block-title>
  <f7-list>
    <li>
      <div class="item-content">
        <div class="item-inner">
          <div class="item-title">
            IP Address
          </div>
          <div class="item-after">{{ connection.localIP }}</div>
        </div>
      </div>
    </li>
    <li>
      <div class="item-content">
        <div class="item-inner">
          <div class="item-title">
            Subnet Mask
          </div>
          <div class="item-after">{{ connection.subnetMask }}</div>
        </div>
      </div>
    </li>
    <li>
      <div class="item-content">
        <div class="item-inner">
          <div class="item-title">
            Router
          </div>
          <div class="item-after">{{ connection.gatewayIP }}</div>
        </div>
      </div>
    </li>
    <li>
      <div class="item-content">
        <div class="item-inner">
          <div class="item-title">
            DNS
          </div>
          <div class="item-after">{{ connection.dnsIP }}</div>
        </div>
      </div>
    </li>
  </f7-list>
  <f7-list>
    <li>
      <a href="#" class="item-link list-button" v-on:click="setDisconnect(true)">
          Disconnect
      </a>
    </li>
  </f7-list>
</f7-page>
</template>

<script>
import state from '../state.js'

export default {
  data() {
    return state
  },
  methods: {
    setDisconnect: function(disconnect) {
      if (disconnect) {
        var self = this;
        this.$f7.confirm('Device \"' + self.device + '\" will be disconnected from the Wi&#8209;Fi network.',
        'Disconnect from Wi&#8209;Fi network "' + self.connection.ssid +'\"&nbsp;?', function () {
          self.disconnect = true;
          self.$f7.mainView.back();
        });
      } else {
        disconnect = false;
      }
    },
    aferBack: function() {
      if (this.disconnect) {
        this.ws.send(
          JSON.stringify({
            _type: "request",
            id: "id",
            requestType: "delete",
            resource: "connection"
          }));
      }
    }
  }
}
</script>
