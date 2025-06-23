
//http://localhost:8003/primo-explore/fulldisplay?docid=33PUDB_Alma_Marc7167182610004671&context=L&vid=33PUDB_UB_VU2&lang=en_US&search_scope=catalog_pci&adaptor=Local%20Search%20Engine&tab=default_tab&query=any,contains,revue%20de%20droit&offset=0
//http://localhost:8003/primo-explore/fulldisplay?docid=33PUDB_Alma_Unimarc7157521910004671&context=L&vid=33PUDB_UB_VU2&lang=en_US&search_scope=catalog_pci&adaptor=Local%20Search%20Engine&tab=default_tab&query=any,contains,revue%20fran%C3%A7aise%20de%20gestion
import dispoElecAutresInstHTML from './dispoElecAutresInst.html'

class dispoElecAutresInstController {
  constructor($sce,$translate, $mdToast, $rootScope, $cookies, $element) {
    this.$onInit = function () {
      this.sce = $sce;
      this.$translate = $translate;
      this.$mdToast = $mdToast;
      this.$rootScope = $rootScope;
      this.$cookies = $cookies;
      this.element = $element;
      /****************************************************************************** */
      /* Empêche l'affichage des deux champs lds01 det lds02 ans le cas d'une notice fusionnée */
      /****************************************************************************** */
      /*Lorsqu'une notice est fusionnée Primo conserve tous les champs locaux. Ainsi le*/
      /* champ lds01 & lds02 que nous utilisons pour afficher l'adresse bibliographique de la  */
      /*publication est doublé. Ce module ne conserve que le champ construit à partir  */
      /*de la notice Unimarc.*/
      if(this.parentCtrl.item.context == "L" && this.parentCtrl.item.pnx.control.recordid[0].startsWith('dedup')){
        this.parentCtrl.item.pnx.display.lds01 = [this.parentCtrl.item.pnx.display.lds01[0]]
        this.parentCtrl.item.pnx.display.lds02 = [this.parentCtrl.item.pnx.display.lds02[0]]
      }

      // /***********************************/
      /* Mise en forme des résultats CDI */
      /********************************* */
      //Nous utilisons des champs locaux pour alimenter les 2ème (lds02) & 3ème (lds01) lignes du brief display. 
      //Les champs Auteurs publisher et partof (pour lesa rticles) utilisé initialement pour la section brief display de l'affichage détaillée
      //ne remontent plus pour PCI. 
      //Ce correctif permet de récupérer les champs Pnx et les afficher dans l'affichage abrégé.
      /**************************************************************************************** */
      if (this.parentCtrl.item.context == "PC") {
        var auteur = this.parentCtrl.item.pnx.display.creator;
        var editeur = (typeof this.parentCtrl.item.pnx.display.publisher != "undefined") ? this.parentCtrl.item.pnx.display.publisher : this.parentCtrl.item.pnx.display.source;
        var pubDate = this.parentCtrl.item.pnx.display.creationdate;
        var ispartof = this.parentCtrl.item.pnx.display.ispartof;
        this.parentCtrl.item.pnx.display.lds02 = auteur
        if (typeof ispartof === "undefined") {
          this.parentCtrl.item.pnx.display.lds01 =  [editeur + " : " + pubDate];
        }
      }
      // /***********************************/
      /*[33PUDB_NETWORK_AFA] - Affiche la disponibilité des RE dans une autre institution*/
      /********************************* */
      /* Parfois les services ne sont pas passés au controleur parent...*/

      if (typeof this.parentCtrl.service !== 'undefined'){
        this.serviceName = this.parentCtrl.service.scrollId;

        /*On ne travaille qu'au niveau du view it*/
        if (this.serviceName == "getit_link1_0" && this.parentCtrl.service.linkElement.category == "Alma-E") {
          console.log('---->dispoElecAutresInstController');
          // console.log(this);
          //Vue actuelle
          this.isDedup = this.parentCtrl.item.pnx.control.recordid[0].startsWith('dedup')
          this.REBUB_vue = this.parentCtrl.configurationUtil.vid;
          //Je récupère le code de l'institution
          this.REBUB_institution = this.parentCtrl.configurationUtil.vid.match(/(33PUDB_\S+?)_/)[1];
          this.institutionsLIst = [];
          this.dispos = this.parentCtrl.item.pnx.delivery.delcategory;
          this.isShowContent = {};
          // console.log(this);
          //Je construit une liste avec chaque institution proposant l'accès électronique au documment (pnx/delivery/delcategory)
          for (var i = 0; i < this.dispos.length; i++) {
            var dispoElement = this.dispos[i].match(/(\$\$V|^)(.*?)\$\$I(.*?)(\$|$)/);
            if (dispoElement[2] == "Alma-E" && dispoElement[3] != this.REBUB_institution && dispoElement[3] != "33PUDB_NETWORK") {
              this.institutionsLIst.push(dispoElement[3]);
              this.isShowContent[dispoElement[3]] = false;
            }
          }
          this.dispo_autres_inst = this.institutionsLIst.length > 0 ? true : false;
          // console.log(this.institutionsLIst);
        }
      // /***********************************/
      /*[33PUDB_NETWORK_AFA - 24062024] - Affichage d'une section "En rayon" alors qu'il n'y a pas de version imprimée du document*/
      /********************************* */
      /* Dans l'affichage d'une notice détaillée, quand le document ne propose qu'un accès numérique, la section "En rayon" s'affiche quand même. Ce pb. est lié au fait que 
      Primo va systématiquement lancer une requête au résolveur de lien pour les notices électroniques (qu'elles soient locales ou de CDI) et il ne peut pas savoir si cette dernière
      Renverra des résulats. Cet appel au résolveur est réalisé dans une section de l'affichage détaillé baptisée getit_link2. L'appel au résolveur de lien est utilr pour les notices CDI
      car il permet de remonter des dispo physiques supplémentaires mais ne l'ai pas pour des notices électroniques LOcales. Le code ci-dessous n'affiche pas dde getit2 pour les notices locales
      décrivant des documents n'ayant de disponibilités en version physique */
        if (this.serviceName == "getit_link2" && this.parentCtrl.item.context == "L") {
          //On exclu la disponibilité physique pour la NZ
          // console.log(this.parentCtrl.item.pnx.delivery);
          const regex_pasnz = /^((?!Alma-P\$\$I33PUDB_NETWORK).)*$/g;
          const dispos = this.parentCtrl.item.pnx.delivery.delcategory.filter(delcategory => delcategory.match(regex_pasnz));
          // On retire de la liste toutes les localisations autres que physique
          const regex_pas_physique = /^.*Alma-P.*$/g;
          const disposDocPhys = dispos.filter(dispo => dispo.match(regex_pas_physique));
          // S'il n'y aps de disponibilité physique alors je n'affiche pas le getit_link2
          if (disposDocPhys.length == 0){
            this.element.parent().remove();
          }
        }
      } 
    };
  }

  showComponent(institution) {

    /*Construction de l'Open Url*/
    /************************** */
    var instanceAlma = institution.match(/33PUDB_(.*)/)[1].toLowerCase();
    var skin = institution + '_VU1';
    var langue = this.parentCtrl.item.lang3 ? this.parentCtrl.item.lang3 : "fre";
    var date = new Date();
    var ctxTim = date.toISOString();
    /*On récupère l'identifiant des notices Alma*/
    var almaIdList = this.parentCtrl.item.pnx.control.almaid;
    var ids_notice = [];
    for (var i = 0; i < almaIdList.length; i++) {
      /*Si la notice est fusionnée, les idAlma sont affichés comme ça : $$V33PUDB_NETWORK:7167176110004671$$O33PUDB_Alma_Marc7167176110004671
      On extrait l'identifiant et on filtre les notices électroniques (Alma_Marc)*/
      if (this.isDedup){
        var idElement = almaIdList[i].match(/\$\$V(.*?)\$\$O.*?_.*?_(.*?)\d/);
        if (idElement[2] == 'Marc'){
          ids_notice.push('ie=' + idElement[1]);
        }
      }
      else{
        ids_notice.push('ie=' + almaIdList[i]);
      }
    }
    this.openUrl = "https://pudb-" + instanceAlma
                   + ".userservices.exlibrisgroup.com/view/uresolver/"
                   + institution 
                   + "/openurl?ctx_enc=info:ofi/enc:UTF-8&ctx_id=10_1&ctx_tim=" 
                   + ctxTim 
                   + "&ctx_ver=Z39.88-2004&url_ctx_fmt=info:ofi/fmt:kev:mtx:ctx&url_ver=Z39.88-2004&rfr_id=info:sid/primo.exlibrisgroup.com-33PUDB_Alma_Marc&req_id=&rft_dat=" 
                   + ids_notice.toString() 
                   + ",language=" 
                   + langue
                   + ",view=" 
                   + this.REBUB_vue
                   + "&svc_dat=viewit&u.ignore_date_coverage=true&is_new_ui=true&Force_direct=false&req.skin=" 
                   + skin;
    /*Masquage/Affichage  de l'iframe*/
    /******************************** */
    for (var i in this.isShowContent) {
      // console.log(i);
      if(i != institution){
        this.isShowContent[i] = false;  
      }
    }
    this.isShowContent[institution] = !this.isShowContent[institution];
    this.templateURL = 'custom/CENTRAL_PACKAGE/js/prmFullViewServiceContainerAfter/bouttonAfficheDispoElec.html';
    // console.log(this.isShowContent);

  }
  trustAsUrl(url){
    return this.sce.trustAsResourceUrl(url);
  }
}

dispoElecAutresInstController.$inject = ['$sce','$translate', '$mdToast', '$rootScope', '$cookies', '$element'];

export let dispoElecAutresInstConfig = {
  bindings: { parentCtrl: '<' },
  controller: dispoElecAutresInstController,
  template: dispoElecAutresInstHTML
}