
import lienAuthNetwork from "./lienAuthNetwork.html"
var showForInst = ['33PUDB_NETWORK']

class lienAuthNetworkController {

  constructor($http, $element) {
    this.$onInit = function () {
      this.$http = $http;
      this.element = $element;


      console.log("Panier");
      console.log(this);
      let view = this.parentCtrl.view;

      this.hostAuth = this.parentCtrl.$location.$$host;
      console.log("domaine : " , this.hostAuth);
      this.langue = this.parentCtrl.lang;
      this.institution = view.replace(/^(33PUDB_.*?)_.*/, '$1');
      this.showMenu = showForInst.includes(this.institution) ? true : false;
      this.uSMS = this.parentCtrl.userSessionManagerService;
      this.panierUser = "";
      console.log(this);
      

      if (this.uSMS) {
        let jwtData = this.uSMS.jwtUtilService.getDecodedToken() || {};
        console.log(jwtData);
        this.panierUser = jwtData.user;

      }
      this.panierUrl = "https://scoop.u-bordeaux.fr/panier/" + this.panierUser + "/" + this.institution;
    }
  };
};


lienAuthNetworkController.$inject = ['$http', '$element'];
export let lienAuthNetworkConfig = {
  bindings: { parentCtrl: '<' },
  controller: lienAuthNetworkController,
  template: lienAuthNetwork,
}



// 