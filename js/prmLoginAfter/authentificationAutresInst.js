import authentificationForm from './authentificationAutresInst.html'

class authentificationAutresInstController {
    constructor($http, $element) {
        this.$onInit = function () {
            this.element = $element;
            //Debug
            console.log('---->33PUDB authentificationAutresInstController');
            // this.parentCtrl.authenticationMethods.splice(0,1)
      


            // console.log("hostAuth:" + this.hostAuth);
            //On récupère l'URL de départ :
            //[AFA Patch 20/02/2019 : https://trello.com/c/Vsm7VgdA ] On teste le chemin car quand on arrive de l'extérieur et que la page ciblée demande une authentification fournie $$absurl est l'url de l'écran de login. Pour l'instant les seuls liens externes de cetypes pointent vers le compte lecteur. Donc si $$absUrl pointe vers l'écran de login on redirge vers  
            if (this.parentCtrl.$location.$$path == "/login") {
                this.absUrl = 'https://' + this.hostAuth + '/primo-explore/account?vid=33PUDB_UBM_VU1&section=overview';
                //URL pour le travail en localhost
                // this.absUrl = 'https://babordplus.hosted.exlibrisgroup.com/primo-explore/account?vid=33PUDB_UBM_VU1&section=overview';
            }
            else {
                this.absUrl = this.parentCtrl.$location.$$absUrl;
            }
            //On encode correctement l'URL targeturl 
            this.absUrl = encodeURIComponent(this.absUrl);
            // console.log("absUrl:" + this.absUrl);
            // console.log("sourceView:" + this.sourceView);
            //On récupére la langue de la session
            this.langue = this.parentCtrl.$stateParams.lang;
            // On recupere le code vue source
            this.sourceView = this.parentCtrl.$location.$$search.vid;
            //On contruit le debut de l'url pour l authentification
            this.auth_base_url_const = 'https://' + this.hostAuth + '/primo_library/libweb/primoExploreLogin?institution=';
            //URL Pour tester en local
            // this.auth_base_url_const = 'https://babordplus.hosted.exlibrisgroup.com/primo_library/libweb/primoExploreLogin?institution=' ;
            //Parcours d'une liste asso pour afficher auth IdP supplementaires
            if (this.hostAuth === 'babordplus-bordeaux.fr') {
                this.PUDB_Auth_Lists = [
                    ["1", "33PUDB_BXSA", "33PUDB_BXSA_NEWDOMAIN_SAML_BXSA", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_BXSA_VU1"), "33PUDB_BXSA_VU1", "Bordeaux Sciences Agro", "BXSA"],
                    ["2", "33PUDB_IEP", "33PUDB_IEP_NEWDOMAIN_SAML_IEP", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_IEP_VU1"), "33PUDB_IEP_VU1", "Bordeaux Sciences Po", "IEP"],
                    ["3", "33PUDB_UB", "33PUDB_UB_NEWDOMAIN_SAML_UB", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_UB_VU1"), "33PUDB_UB_VU1", "Université de Bordeaux", "UB"],
                    ["4", "33PUDB_UBM", "33PUDB_UBM_NEWDOMAIN_SAML_UBM", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_UBM_VU1"), "33PUDB_UBM_VU1", "Université Bordeaux Montaigne", "UBM"],
                    ["5", "33PUDB_INP", "33PUDB_INP_NEWDOMAIN_SAML_INP", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_INP_VU1"), "33PUDB_INP_VU1", "Bordeaux INP", "INP"]
                ];
            }
            else {
                this.PUDB_Auth_Lists = [
                    ["1", "33PUDB_BXSA", "33PUDB_BXSA_SAML_BXSA", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_BXSA_VU1"), "33PUDB_BXSA_VU1", "Bordeaux Sciences Agro", "BXSA"],
                    ["2", "33PUDB_IEP", "33PUDB_IEP_SAML_IEP", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_IEP_VU1"), "33PUDB_IEP_VU1", "Bordeaux Sciences Po", "IEP"],
                    ["3", "33PUDB_UB", "33PUDB_UB_SAML_UB", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_UB_VU1"), "33PUDB_UB_VU1", "Université de Bordeaux", "UB"],
                    ["4", "33PUDB_UBM", "33PUDB_UBM_SAML_UBM", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_UBM_VU1"), "33PUDB_UBM_VU1", "Université Bordeaux Montaigne", "UBM"],
                    ["5", "33PUDB_INP", "33PUDB_INP_SAML_INPBX", this.absUrl.replace(/vid\%3D33PUDB_.*_VU1/, "vid%3D33PUDB_INP_VU1"), "33PUDB_INP_VU1", "Bordeaux INP", "INP"]
                ];
            }
            // [AFA Patch 21/06/2024] Pour la zone réseau rediriger les utilisateurs à l'authentification vers les vues des institution
            //ATTENTION ! :Nécesite de masquer en CSS dans la vue de la zone réseau le formulaire d'authentification
            this.isNetwork = this.institution == 'NETWORK' ? true : false;

        };
    }

    setIdPShow(institution) {
        //Le lien n'est pas proposé pour l'inst
        // console.log(institution);
        return Boolean(this.parentCtrl.usernamePasswordLoginService.inst !== institution);

    }

    removeProfile(profileName) {
        this.parentCtrl.authenticationMethods = this.parentCtrl.authenticationMethods.filter(profile => profile._profileName !== profileName);
    }
    viewToInstitution(view) {
        const regex = /33PUDB_(.*?)_.*/;
        const found = view.match(regex);
        console.log(found);
        return (found[1]);

    }
}
authentificationAutresInstController.$inject = ['$http', '$element'];
export let authentificationAutresInstConfig = {
    bindings: { parentCtrl: '<' },
    controller: authentificationAutresInstController,
    template: authentificationForm
}