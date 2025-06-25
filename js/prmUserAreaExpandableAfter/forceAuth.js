class forceAuthController {
    constructor(){
      console.log("forceAuthController initialized");
      this.$onInit = function () {
        console.log("forceAuthController initialized");
        var forceLogin = getQueryParam(this.parentCtrl.loginService.$location.$$absUrl, "forcelogin")
        if (forceLogin == 'true'){
          console.log("redirection",this.parentCtrl)
          let target_url = this.parentCtrl.loginService.$location.$$absUrl.replace('&forcelogin=true','')
          target_url = encodeURIComponent(target_url);
          let institution = this.parentCtrl.authenticationService.userSessionManagerService.inst;
          let authenticationProfile = institution.replace('33PUDB_','') + "_SAML";
          let auth_url = "/primaws/suprimaExtLogin?institution="+institution+"&lang=fr&target-url="+target_url+"&authenticationProfile="+authenticationProfile+"&idpCode="+authenticationProfile+"&auth=SAML&view="+this.parentCtrl.view+"&isSilent=true";
          console.log("auth_url", auth_url);
          location.href = auth_url;
        }
        
        
        function getQueryParam(url, key) {
          var queryStartPos = url.indexOf('?');
          if (queryStartPos === -1) {
            return;
          }
          var params = url.substring(queryStartPos + 1).split('&');
          for (var i = 0; i < params.length; i++) {
            var pairs = params[i].split('=');
            if (decodeURIComponent(pairs.shift()) == key) {
              return decodeURIComponent(pairs.join('='));
            }
          }
        }
      };
    }
    
  }
  export let forceAuthConfig = {
    bindings: {parentCtrl:'<'},
    controller: forceAuthController
  }