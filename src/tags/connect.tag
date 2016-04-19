<connect>
  <div class="container">
    <form class="form form-connect" role="form">
      <h1 class="form-connect-heading">Please connect me to your WiFi</h1>
      <br />
      <div class="form-group">
        <label for="name">My name is</label>
        <input name="name" type="text" class="form-control"/>
      </div>
      <div class="form-group">
        <label for="network">WiFi network</label>
        <div class="input-group">
          <input name="wifi_network" type="text" class="form-control"/>
          <div class="input-group-btn">
 	        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
              <div class="dropdown-button">
                <div name="spinner" class="spinner">
                  <div class="double-bounce1"></div>
                  <div class="double-bounce2"></div>
                </div>
                <div name="caret" class="dropdown-caret">
                </div>
              </div>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
              <li each={ wifi_networks }>
                <a href="#" onclick={ parent.selectWiFi }>
                  <i class="glyphicon" style="width:24px"> 
                    <ul class="signal-bars bars-{ signal_strength }">
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
                  </i>
                  <i class="icon-lock"></i>
                  { name }
                </a>
              </li>
   
             <!-- <li each={ wifi_networks }>
                <a href="#" onclick={ parent.selectWiFi }>
                  <i class="icon-lock"></i>
                 <ul class="signal-bars bars-{ signal_strength }">
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
                  { name }
                </a>
              </li> -->
            </ul>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="password">WiFi password</label>
        <input id="password" type="password" class="form-control"/>
      </div>
      <br />
      <div class="form-group">
        <button class="btn btn-lg btn-primary btn-block" type="submit">Connect</button>
      </div>
    </form>
  </div>
 <script>
   
   this.on('mount', function() {
     var dropdown = this.root.querySelector('[data-toggle=dropdown]');
     new Dropdown(dropdown);
   })
      var that = this;
      this.wifi_networks = [{name:"Scanning..."}];
   
   selectWiFi(event) {

    // looped item
    var item = event.item
    if (item.signal_strength)
      that.wifi_network.value = item.name;
  }
   
      fetch('/api/settings')
       .then(function(response) {
          return response.json()
        })
       .then(function(json) {
          that.name.value = json.name;
          that.wifi_network.value = json.wifi_network;
        })
        .catch(function(ex) {
          console.log('settings parsing failed', ex)
      })
      fetch('/api/wifi_networks')
        .then(function(response) {
          return response.json()
        })
       .then(function(json) {
          that.spinner.style.opacity = 0;
          that.caret.style.opacity = 1;
          that.wifi_networks = json.sort(function(a, b) {
            return b.signal_strength - a.signal_strength;
          })
          that.wifi_networks.forEach(function(entry) {
            entry.signal_strength = Math.floor(entry.signal_strength / 25) + 1;
          });
          that.update();
        })
        .catch(function(ex) {
          that.spinner.style.opacity = 0;
          that.caret.style.opacity = 1;
          console.log('wifi networks parsing failed', ex)
      })
 </script>
</connect>