import {authentificationAutresInstConfig} from './prmLoginAfter/authentificationAutresInst';
import {logosInstsConfig} from './prmExploreFooterAfter/logosInsts';
import {customBriefDisplayConfig} from './prmBriefResultAfter/customBriefDisplay';
import {customRequestConfig} from './prmRequestAfter/customRequest';
import {forceAuthConfig} from './prmUserAreaExpandableAfter/forceAuth';
import {tLevelFacetteConfig} from './prmFacetExactAfter/customTLevelFacette'
// A activer avant de compiler
// let app = angular.module('centralCustom',['angularLoad','ngMaterial']);
// Activer pour le développement
let app = angular.module('viewCustom', ['angularLoad', 'ngMaterial']);
console.log("Début de la personnalisation angular");
console.log("Modules AngularJS chargés : angularLoad, ngMaterial");
if (app){
    //Customisation de l'écran d'authentification. Redirection vers les Primo des établissements du réseau
    app.component('prmLoginAfter', authentificationAutresInstConfig);
    //Customisation de l'affichage des notices dans la liste des résultats
    app.component('prmBriefResultAfter', customBriefDisplayConfig);
    //Ajoute un pied de page avec les logos des autres institutions membres du réseau et le lien vers leurs catalogues
    app.component('prmExploreFooterAfter',logosInstsConfig);
    app.component('prmRequestAfter', customRequestConfig);
    app.component('prmUserAreaExpandableAfter',forceAuthConfig);
    app.component('prmFacetExactAfter', tLevelFacetteConfig);
} 
// Ajout d'un service permettant l'envoi des références vers ZoteroBib
// START ------ Primo-ZoteroBib-Add-On ------/
function insertActions(actions) {
    app.service('customActionService', function() {
        return {
            actions: [],
            processCustomAction: function(prmActionCtrl, action) {
                action.slug = action.name.replace(/\s+/g, ''); // remove whitespace
                action.iconname = action.slug.toLowerCase();
                action.index = Object.keys(prmActionCtrl.actionListService.actionsToIndex).length - 1 ; // ignore "none" and RISPushTo
                this.actions.push(action);
                return action;
            },
            setCustomAction: function(prmActionCtrl, action) {
                    prmActionCtrl.actionLabelNamesMap[action.slug] = action.name;
                    prmActionCtrl.actionIconNamesMap[action.slug] = action.iconname;
                    prmActionCtrl.actionIcons[action.iconname] = {
                        icon: action.icon.name,
                        iconSet: action.icon.set,
                        type: "svg"
                    };
                    if (!prmActionCtrl.actionListService.actionsToIndex[action.slug]) { // ensure we aren't duplicating the entry
                        prmActionCtrl.actionListService.requiredActionsList[action.index] = action.slug;
                        prmActionCtrl.actionListService.actionsToDisplay.unshift(action.slug);
                        prmActionCtrl.actionListService.actionsToIndex[action.slug] = action.index;
                    }
                    
                    var actionurl = "";
                                                        
                    if (action.type === 'urlredirectzotero') {
                      console.log(prmActionCtrl.item);
                        var zoterobibq = "0";
                        //Construct link to PNX record
                        var url = new URL(document.location.href);
                        var hostname = url.hostname;
                         console.log(url.hostname);
                        var context = prmActionCtrl.item.context
                        var recordid = prmActionCtrl.item.pnx.control.recordid;
                        var linktopnx = prmActionCtrl.item.pnx;
                        // var linktopnx ="https://babordplus.hosted.exlibrisgroup.com/primo_library/libweb/webservices/rest/primo-explore/v1/pnxs/xml/"+context+"/"+recordid+"?inst=33PUDB_NETWORK%26showPnx=true";
                        // var linktopnx ="https://"+url.hostname+"/primo_library/libweb/webservices/rest/primo-explore/v1/pnxs/xml/"+context+"/"+recordid+"?inst=33PUDB_UB%26showPnx=true";
                          //check is RISTYPE Exists
                          if (typeof prmActionCtrl.item.pnx.addata.ristype == 'undefined'){
                            console.log("format" + prmActionCtrl.item.pnx.addata.format);
                            zoterobibq = linktopnx;
                          }else{
                            console.log("format" + prmActionCtrl.item.pnx.addata.ristype.toString().toLowerCase())
                            switch(prmActionCtrl.item.pnx.addata.ristype.toString().toLowerCase()) {
                              case "book":
                                zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 0,linktopnx);
                                break;
                              case "jour":
                                zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 1,linktopnx);
                                break;
                              case "gen":
                                zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 2,linktopnx);
                                break;
                              case "thes":
                                zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 3, linktopnx);
                                break;

                              default:
                                zoterobibq = getZoterobibq(prmActionCtrl.item.pnx.addata, 4, linktopnx);
                            }								
                          }							  
                      if (action.hasOwnProperty('templateVar')) {
                          action.action = action.action.replace(/{\d}/g, function(r){return action.templateVar[r.replace(/[^\d]/g,'')]});
                          console.log("templateVar");
                      }
                        actionurl = action.action + zoterobibq;
                        console.log(actionurl);
                    }						
                    prmActionCtrl.actionListService.onToggle[action.slug] = function(){							
                        window.open(actionurl, '_blank'); // opens the url in a new window
                    };
            },
            setCustomActionContainer: function(mdTabsCtrl, action) { // for further review...
            },
            getCustomActions: function() {
                return this.actions;
            }
        };
    })
    .component('prmActionListAfter', {
        require: {
            prmActionCtrl: '^prmActionList',
        },
        controller: 'customActionController'
    })
    .controller('customActionController', ['$scope', 'customActionService', function($scope, customActionService) {
        var vm = this;
        vm.$onInit = function() {			
            actions.forEach(function(action) {
                var processedAction = customActionService.processCustomAction(vm.prmActionCtrl, action);
                customActionService.setCustomAction(vm.prmActionCtrl, processedAction);
                
            });
        };
    }])
}
// END ------ Primo-VE-ZoteroBib-Add-On ------/	


//Replace name and icon with you own
insertActions([{
    name: "ZoteroBib",
    type: "urlredirectzotero",
    icon: {
        set: 'primo-actions',
        name: 'easybib'
    },
    action: "https://zbib.org/import?q="
}]);


//Place this function outside the main function
//Function to get ISBN, DOI, PMID,arXiv ID, or title
function getZoterobibq(addata, risformattype, linktopnx)
{
	switch(risformattype) {
    case 0: // book
    if (typeof addata.isbn !== 'undefined')
        if(addata.isbn.length > 1)
            return addata.isbn[0];
        else
            return addata.isbn;
    return linktopnx;
		break;
	  case 1: //jour
		if (typeof addata.doi !== 'undefined')
			return addata.doi;
		if (typeof addata.pmid !== 'undefined')
			return addata.pmid;
		if (typeof addata.lad21 !== 'undefined')
			return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');
    return linktopnx;
        break;
	  case 2: //gen
		if (typeof addata.doi !== 'undefined')
			return addata.doi;
		if (typeof addata.pmid !== 'undefined')
			return addata.pmid;
		if (typeof addata.lad21 !== 'undefined')
			return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');
    return linktopnx;
        break;
	  case 3: //thesis
		if (typeof addata.doi !== 'undefined')
			return addata.doi;
		if (typeof addata.pmid !== 'undefined')
			return addata.pmid;
		if (typeof addata.lad21 !== 'undefined'){
            return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');}
    return linktopnx;
		break;
	  default:// will use the title if no ISBN, DOI, PMID,arXiv ID
		return linktopnx;
	}
}
/* Add count to availability facet */
angular
.module('availabilityCounts', [])
.component('availabilityCounts', {
  controller: function ($scope, availabilityCountsOptions) {

    var avail_group = 'tlevel';

    this.$onInit = function () {
      var parent_ctrl = $scope.$parent.$parent.$ctrl;
      this.facet_group = parent_ctrl.facetGroup.name;
      this.facet_results = parent_ctrl.facetService.results;
      if (this.facet_group == avail_group) {
        this.processFacets();
      }
      // copy options from local package or central package defaults
      this.msg = availabilityCountsOptions.msg;
    }

    this.processFacets = function () {
      var self = this;
      if (!self.msg) self.msg = '* Counts are approximate. Results may differ.';

      angular.forEach(self.facet_results, function (result) {
        if (result.name == avail_group) {
          var first_value = result.values[0].value;
          var interval = setInterval(find_facet, 100);
          function find_facet() {
            if (document.querySelector(self.getSelector(first_value))) {

              // Clear interval
              clearInterval(interval);

              // Add availability counts as spans
              angular.forEach(result.values, function (facet) {
                var selector = self.getSelector(facet.value);
                if (document.querySelector(selector)) {
                  var facet_item = document.querySelector(selector);
                  if (facet_item.querySelector('.facet-counter') == null) {
                    var facet_text = facet_item.querySelector('.text-number-space');
                    var span = document.createElement('span');
                    var count = document.createTextNode(facet.count.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '*');
                    span.setAttribute('class', 'text-italic text-in-brackets text-rtl facet-counter');
                    span.appendChild(count);
                    facet_text.after(span);
                  }
                }
              });

              // Facets are created and destroyed in the DOM when the group is toggled so watch for clicks
              var availGroup = document.querySelector(self.getSelector(avail_group));
              availGroup.addEventListener('click', function () {
                self.processFacets();
              });

              // Add warning text
              if (!availGroup.querySelector('.section-content .warning')) {
                var warning = document.createElement('span');
                var warningText = document.createTextNode(self.msg);
                warning.setAttribute('class', 'warning');
                warning.appendChild(warningText);
                availGroup.querySelector('.section-content').appendChild(warning);
              }
            }
          }
        }
      });
    }

    this.getSelector = function (value) {
      if (value == avail_group) {
        return 'div[data-facet-group="' + avail_group + '"]';
      }
      else {
        return 'div[data-facet-value="' + avail_group + '-' + value + '"]';
      }
    }

  }
})
// Set default values for options
.value('availabilityCountsOptions', {
  msg: '* Counts are approximate. Results may differ.'
});
//* End availability counts *//