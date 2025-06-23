var showForInst = ['33PUDB_UB','33PUDB_BXSA']

class panierController {

  constructor($http,$element) {
    this.$onInit = function () {
      this.$http = $http;
      this.element = $element;  
 
     
      console.log("Panier");
      console.log(this);
      let view = this.parentCtrl.view;

      this.institution = view.replace(/^(33PUDB_.*?)_.*/, '$1');
      this.showLink = showForInst.includes(this.institution) ? true : false; 
      this.uSMS = this.parentCtrl.userSessionManagerService;
      this.panierUser = "";
      console.log(this);
    
      if (this.uSMS) {
        let jwtData = this.uSMS.jwtUtilService.getDecodedToken() || {};
        console.log(jwtData);
        this.panierUser = jwtData.user;

      }
      this.panierUrl = "https://scoop.u-bordeaux.fr/panier/" +  this.panierUser +"/" + this.institution;
    }
  };
  };


  panierController.$inject = ['$http','$element'];
  export let panierConfig = {
      bindings: {parentCtrl:'<'},
      controller: panierController,
      template: `
        <div ng-if="$ctrl.showLink == true" id="panier-covid" class="layout-align-center layout-row">
          <a class="md-icon-button button-over-dark md-button md-primoExplore-theme md-ink-ripple"
                    aria-label="Votre Panier" ng-click="$ctrl.openHelpMenu($event)"
                    href="{{$ctrl.panierUrl}}" target="_blank" title="Accèder à vos documents réservés pour finaliser la commande">
            <prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_shopping_basket_24px"></prm-icon>
          </a>
        </div>`,
    }
    
class panierCompteLecteurController {
    constructor($http,$element) {
      console.log("Lien Panier");
      console.log(this);
      this.$http = $http;
      this.element = $element;
      this.cetcinst=showForInst;
      console.log(this.requestsCounter)
      let jwtData = this.parentCtrl.jwtUtilService.getDecodedToken() || {};
      console.log(jwtData);
      this.panierUser = jwtData.user;
      // this.institution = jwtData.institution.replace(/^33PUDB_(.*?)$/, '$1');
      // this.showLink = (showForInst.includes(this.institution) && this.request_count > 0) ? true : false; 
      // // console.log(this.parentCtrl.accountOverviewService);
      // this.panierUrl = "https://scoop.u-bordeaux.fr/panier/" +  this.panierUser +"/" + this.institution;

    }
  };


  panierCompteLecteurController.$inject = ['$http','$element'];
  export let panierCompteLecteurConfig = {
      bindings: {parentCtrl:'<'},
      controller: panierCompteLecteurController,
      template: `
       <a ng-if="$ctrl.parentCtrl.requestsCounter > 0 && $ctrl.cetcinst.indexOf($ctrl.parentCtrl.accountOverviewService.linkedUserSelectorService._selectedInstitution.institutionCode) > -1"
          class="button-link md-button button-large md-primoExplore-theme md-ink-ripple"
          type="button"
          href="https://scoop.u-bordeaux.fr/panier/{{ $ctrl.panierUser }}/{{ $ctrl.parentCtrl.accountOverviewService.linkedUserSelectorService._selectedInstitution.institutionCode }}"
          target="_blank" title="Accèder à vos documents réservés pour finaliser la commande" style="">
         <prm-icon icon-type="svg" svg-icon-set="action" icon-definition="ic_shopping_basket_24px"></prm-icon>
         <span>Prendre rendez-vous pour le retrait des documents</span>
       </a>`,
    }

    // 