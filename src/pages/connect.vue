<template>
<f7-page>
  <div v-if="selectedNetwork.network">
    <f7-navbar :title="selectedNetwork.network.ssid" back-link="Back" sliding/>
  </div>
  <div v-if="!selectedNetwork.network">
    <f7-navbar title="Other Network" back-link="Back" sliding/>
  </div>
  <f7-list v-if="selectedNetwork.encryption !== 'none'">
    <f7-list-item v-if="!selectedNetwork.network">
      <f7-label>Name</f7-label>
      <f7-input id="ssid" type="text" placeholder="network name" v-model="selectedNetwork.ssid">
      </f7-input>
    </f7-list-item>
    <f7-list-item>
      <f7-label>Password</f7-label>
      <f7-input id="password" type="password" placeholder="password" v-model="selectedNetwork.password">
      </f7-input>
    </f7-list-item>
  </f7-list>
  <f7-list>
    <li>
      <a href="#" class="item-link list-button back" v-on:click="connect()">
          Connect
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
    connect: function(value) {
      this.$$('.page-content').scrollTop(0, 300);
      this.ws.send(
        JSON.stringify({
          _type: "request",
          id: "id",
          requestType: "delete",
          resource: "connection"
        })
      );
      this.ws.send(
        JSON.stringify({
          _type: "request",
          id: "id",
          requestType: "create",
          resource: "connection",
          content: {
            _type: "connection",
            ssid: this.selectedNetwork.ssid,
            password: this.selectedNetwork.password
          }
        })
      );
    }
  }
}
</script>
