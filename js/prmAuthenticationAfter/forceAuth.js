class forceAuthController {
    constructor(){
      this.$onInit = function () {
        var forceLogin = getQueryParam(this.parentCtrl.loginService.$location.$$absUrl, "forcelogin")
        if (forceLogin == 'true'){
          // console.log("redirection");
          let target_url = this.parentCtrl.loginService.$location.$$absUrl.replace('&forcelogin=true','')
          target_url = encodeURIComponent(target_url);
          let institution = this.parentCtrl.authenticationService.userSessionManagerService.inst;
          let authenticationProfile = institution + "_SAML_" + institution.replace('33PUDB_','')
          let auth_url = "/primo_library/libweb/primoExploreLogin?institution="+institution+"&lang=fr_FR&target-url="+target_url+"&authenticationProfile="+authenticationProfile;
          location.href = auth_url;
        }
        
        // location.href = "http://example.com";
        
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