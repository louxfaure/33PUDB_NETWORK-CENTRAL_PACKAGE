class changeLinkToCollectionDiscoveryController {
    // 

    constructor($element, $translate) {
        this.$translate = $translate;
        this.$element = $element;
        this.$onInit = function () {
            var view_institution = this.parentCtrl.$stateParams.vid.substr(0, this.parentCtrl.$stateParams.vid.length - 4 );
            var collection_institution = this.parentCtrl._breadcrumbStateParams.inst ? this.parentCtrl._breadcrumbStateParams.inst : view_institution;
            console.log(view_institution + "/" + collection_institution);
            console.log(this)
            console.log( this.$element.parent().children()[0]);
            //Si l'institution de la vue n'est pas la même que celle de la collection on modifie la vue dans le lien de redirection 
            // pour renvoyer vers la vue de l'institution propriétaire de la collection.
            if (view_institution != collection_institution){

                this.parentCtrl._breadcrumbStateParams.vid = collection_institution + '_VU1';
                //On force le rechargemene de la page pour appliquer le changement de vue 
                this.$element.parent().children()[0].setAttribute("target", "_self");
            }
            

            //On ajoute le nom de l'institution propriétaire de la collection au niveau du lien de premier niveau  
            if (typeof this.parentCtrl._breadcrumbStateParams.collectionId === "undefined" && typeof this.parentCtrl.$stateParams.collectionId === "undefined") {
                let title;
                this.$translate('nui.colldiscovery.lobby.linktitle.'+ this.parentCtrl.institution).then((translation) => {
                    title = translation
                    console.log(title);
                    this.$element.parent().children()[0].children[0].innerText = title;
                
                });
            
                // 33PUDB_UB.nui.colldiscovery.lobby.toptitle
            }
        };

    }
;
}
changeLinkToCollectionDiscoveryController.$inject = ['$element', '$translate'];
export let changeLinkToCollectionDiscoveryConfig = {
    bindings: { parentCtrl: '<' },
    controller: changeLinkToCollectionDiscoveryController
}