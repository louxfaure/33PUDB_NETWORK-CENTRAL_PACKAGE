
/*[33PUDB_NETWORK_AFA] - Customisation de la toplevel facette  */
/*Suprime les entrées 'peer_reviewed','open_access'et'available'*/
class tLevelFacetteController {
  constructor(){
    this.$onInit = function () {

      

        console.log('----> 33PUDB tLevelFacetteController');
        /*Filtre sur la top level facette*/
        if (this.parentCtrl.facetGroup.name == "tlevel"){
            /*Récupère les valeurs de la tlevel facette*/
            var tlevelFacetsValues = this.parentCtrl.facetGroup.values;
            // console.log(tlevelFacetsValues);
            /*Parcours du tableau des valeurs*/
            for (var i = 0; i < tlevelFacetsValues.length; i++) {
                /*Récupère le nom de la facette*/
                var facetName = tlevelFacetsValues[i].value;
                // console.log(facetName);
                /*On supprime les entrées relatives à la tlevel*/
                if (['peer_reviewed', 'open_access', 'available'].includes(facetName)) {
                    tlevelFacetsValues.splice(i, 1);
                    i = i - 1;
                    // console.log("Supprimée");
                }
            }
        }
      

    };
  }

  get recordid() {
    return this.parentCtrl.item.pnx.control.recordid[0];
  }
}

export let tLevelFacetteConfig = {
  bindings: {parentCtrl:'<'},
  controller: tLevelFacetteController
}
