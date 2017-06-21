<template>
<div class="item-content">
  <div class="item-media">
    <div v-if="network.state === 'connected'">
      <i class="icon item-icon icon-ok"></i>
    </div>
    <div v-else-if="network.state === 'connecting'">
      <i class="icon title-icon icon-arrows-cw animate-spin"></i>
    </div>
    <div v-else>
      <i class="icon icon-none"></i>
    </div>
  </div>
  <div class="item-inner">
    <div class="item-title">
      <div class="wifi">{{ network.ssid }}</div>
      <div v-if="network.encryption === 'none'">
        <div class="encryption">Unprotected</div>
      </div>
      <div v-else-if="network.encryption === 'unknown'">
        <div class="encryption">Protected</div>
      </div>
      <div v-else>
        <div class="encryption">Protected with {{ network.encryption }}</div>
      </div>
    </div>
    <div class="item-after">
      <div style="display: inline-block">
        <div v-if="network.encryption === 'none'">
          <i class="icon item-icon icon-none"></i>
        </div>
        <div v-else>
          <i class="icon item-icon icon-lock"></i>
        </div>
      </div>
      <ul :class="'signal-bars bars-' + network.rssi">
        <li class="first-bar bar">
          <div></div>
        </li>
        <li class="second-bar bar">
          <div></div>
        </li>
        <li class="third-bar bar">
          <div></div>
        </li>
        <li class="fourth-bar bar">
          <div></div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['network']
}
</script>
