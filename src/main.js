// Import Vue
import Vue from 'vue'

// Import F7
import Framework7 from './lib/js/framework7.custom'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue'

// Import F7 iOS Theme Styles
import Framework7Theme from './lib/css/framework7.ios.custom.min.css'
//import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css'
/* OR for Material Theme: */
//import Framework7Theme from './lib/css/framework7.material.custom.min.css'
//import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'


// Import App Custom Styles
import AppStyles from './css/app.scss'
import FontaStyles from './css/fonta.css'
import FontaAnimation from './css/animation.css'

// Import Routes
import Routes from './routes.js'

// Import App Component
import App from './app'

// Init F7 Vue Plugin
Vue.use(Framework7Vue)

// Init App
var app = new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  framework7: {
    root: '#app',
    /* Uncomment to enable Material theme: */
    // material: true,
    routes: Routes,
  },
  // Register App Component
  components: {
    app: App
  }
});
