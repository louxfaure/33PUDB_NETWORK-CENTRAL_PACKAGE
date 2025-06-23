import affDispo from './affDispo.html'
//http://localhost:8003/primo-explore/search?query=any,contains,33PUDB_Alma_Unimarc7156806840004671%20OR%2033PUDB_Alma_Unimarc7180719980004671&tab=default_tab&search_scope=catalog_pci&vid=33PUDB_UBM_VU1&lang=en_US&offset=0
//Cf. case Exlib # 00641786
//Remonte la deuxième mention de disponibilté qui est parfois non affichée quand notices imprimés et électroniques ont été fusionnées 
class affDispoController {
  constructor($scope, $http, $element, $templateCache) {
    this.$onInit = function () {
      this.$element = $element;
      console.log('---->affDispoController');
      //Dans notre contexte consortail une notice supprimée est toujours considérée come disponible dans une autre institution
      //Car elle possède toujours une code "delcategory" pour la zone réseau.
      //Si un résultat n'a qu'un "delcategory" on indique que le document est indisponble pour toutes les institutions 
      if (this.parentCtrl.result.delivery.availability.includes("does_not_exist_in_maininstitution")) {
        if (this.parentCtrl.result.pnx.delivery.delcategory.length == 1) {
          this.parentCtrl.result.delivery.availability = ["unavailable_in_all_institutions"];
        }
      }

      //Lorsqu'un document électronique local est acccessible en ligne pour une autre institution que celle de la vue
      //Primo indique par défaut que le documment est disponible. On modifie cet affichage pour indiquer
      //qu'il est disponible en ligne pour une autre institution
      //On prend la liste des identifiants des notices marc21
      var recordids = []
      for (var i = 0; i < this.parentCtrl.result.pnx.control.sourceid.length; i++) {
        if (this.parentCtrl.result.pnx.control.sourceid[i].startsWith('$$V33PUDB_Alma_Marc')) {
          recordids.push(this.parentCtrl.result.pnx.control.sourceid[i].replace(/^\$\$V33PUDB_Alma_Marc\$\$O(.*)/, '$1'))
        }
      }
      console.log("Dispo :",recordids);
      console.log(this.parentCtrl.result.delivery)
      // console.log(this.parentCtrl.result);
      if (recordids.length > 0 && this.parentCtrl.result.delivery.availability.includes('not_restricted') && !this.parentCtrl.isFullView) {
        var institution = this.parentCtrl.configurationUtil.vid.replace(/^(33PUDB_.*?)_.*/, '$1');
        if (typeof this.parentCtrl.result.pnx.delivery.institution !== 'undefined') {
          this.parentCtrl.result.delivery.availability = ["does_not_exist_in_maininstitution_local_eressource_33PUDB"];
          for (var i = 0; i <= recordids.length; i++) {
            var code_del = "$$V" + institution + "$$O" + recordids[i]
            if (this.parentCtrl.result.pnx.delivery.institution.includes(code_del)) {
              this.parentCtrl.result.delivery.availability = ["not_restricted"];
              break;
            }
            if (this.parentCtrl.result.pnx.delivery.institution.includes(institution)) {
              this.parentCtrl.result.delivery.availability = ["not_restricted"];
              break;
            }
          }
        }
      }
      // Remonte la deuxième mention de disponibilté qui est parfois non affichée quand pour un même document les notices de la version imprimée et électronique ont été fusionnées. 
      // Case # 00641786 chez Exlib
      //[AFA 06/2024 Dans la recherche de revue la dispo est correctement affichée donc on ne produit pas de disponibilité supplémentaire]
      //La recherche de revue est rendue dans une balise <PRM-JOURNALS>
      let contexte = this.$element.parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent()[0].tagName;
      if (this.parentCtrl.result.pnx.control.recordid[0].startsWith('dedup') && contexte != 'PRM-JOURNALS') {
        console.log("Récupère la deuxième mention de dispso");
        console.log("Delivery :",this.parentCtrl.result.delivery);
        console.log("Parent :",this.parentCtrl);
        console.log("deliveryCategory.length : ", this.parentCtrl.result.delivery.deliveryCategory.length);
        console.log("GetIt2 : ", this.parentCtrl.result.delivery.GetIt2);
        console.log("holding : ", this.parentCtrl.result.delivery.holding);
        console.log("element : ", this.$element.parent());

        if (this.parentCtrl.result.delivery.deliveryCategory.length == 1) {
          // CAs 1 Pas dispo physiquement dans l'institution affiche la dispo physique dans d'autres institutions
          if (typeof this.parentCtrl.result.delivery.GetIt2 !== 'undefined' && this.parentCtrl.result.delivery.holding.length > 0) {
            var availability = getAvailabilityStatus(this.parentCtrl.result.delivery.holding);

            this.locations = [];
            this.locations.push({
              availability: availability,
        deliveryCode: 'delivery.code.' + availability,
              // toTranslate: productionVID(window.appConfig.vid),
              useLinkIcon: true,
              // outboundLink: illLink(pnx),
            })
            console.log('---->affDispoController : disponibilité recalculée');
            console.log(availability);
          }
          //Cas 2 Dispo physique mais pas électronique
          if (typeof this.parentCtrl.result.delivery.GetIt2 == 'undefined') {
            console.log("PNX:", this.parentCtrl.result.pnx.delivery.delcategory)
          }

        }
      }
      //Permet de calculer à partir des holdings la disponibilité générique au niveau réseau 
      function getAvailabilityStatus(holding) {
        if (typeof holding == 'undefined' || holding == null) {
          return "unavailable_in_all_institutions";
        }
        var availabilityStatus = [];
        for (var i = 0; i < holding.length; i++) {
          if (holding[i].isValidUser) {
            availabilityStatus.push(holding[i].availabilityStatus);
          }
        }
        if (availabilityStatus.length == 0) {
          return "does_not_exist_in_maininstitution";
        }
        else {
          if (availabilityStatus.includes('available')) {
            return "available_in_maininstitution";
          }
          else {
            return "check_holdings";
          }
        }
      }
    };
  }
}
affDispoController.$inject = ['$scope', '$http', '$element', '$templateCache']
export let affDispoConfig = {
  bindings: { parentCtrl: '<' },
  controller: affDispoController,
  template: affDispo
}
