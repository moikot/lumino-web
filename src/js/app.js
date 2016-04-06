new Vue({
  // We want to target the div with an id of 'events'
  el: '#settings',
  
  // Here we can register any values or collections that hold data
  // for the application
  data: {
   settings: { name: "Moikot's name", wifi_network: 'WiFi network', wifi_password: '********' }
  },

  // Anything within the ready function will run when the application loads
  ready: function () {
    this.fetchSettings();
  },

  // Methods we want to use in our application are registered here
  methods: {
    connect: function () {
    }
  }
});
