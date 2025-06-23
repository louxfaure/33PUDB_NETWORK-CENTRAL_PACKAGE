class customBriefDisplayController {
    constructor() {
        this.$onInit = function () {
            console.log('---->33PUDB customBriefDisplayController');
            console.log('Brief :',this)
            // /***********************************/
            /* Mise en forme des résultats CD */
            /********************************* */
            //Nous utilisons des champs locaux pour alimenter les 2ème & 3ème lignes du brief display. 
            //Les champs Auteurs publisher et partof (pour lesa rticles) utilisé initialement pour le brief display ne remontent plus pour PCI. 
            //Ce correctif permet de récupérer les champs Pnx et les afficher dans l'affichage abrégé.
            /**************************************************************************************** */
            //La notice vient de l'index central
            if (this.parentCtrl.item.context == "PC") {
                var firstLinetext = [];
                var auteur = this.parentCtrl.item.pnx.display.creator;
                var editeur = (typeof this.parentCtrl.item.pnx.display.publisher != "undefined") ? this.parentCtrl.item.pnx.display.publisher : this.parentCtrl.item.pnx.display.source;
                var pubDate = this.parentCtrl.item.pnx.display.creationdate;
                var ispartof = this.parentCtrl.item.pnx.display.ispartof;
                var hSecondValue= {};
                /*Seconde ligne on envoie au composant la zone de l'adresse biblio ou les ref. de la publication dont l'article est tiré*/
                var adresse =  editeur + " : " + pubDate;
                if (typeof ispartof === "undefined") {
                    hSecondValue = {
                        clazz: "media-publisher",
                        codes: [""],
                        key: "publisher",
                        text: [adresse],
                        values: [adresse]
                    };
                }
                else {
                    hSecondValue = {
                        clazz: "media-ispartof",
                        codes: [""],
                        key: "ispartof",
                        text: ispartof,
                        values: ispartof
                    };
                }
                var hSecondLine = {
                    values: [hSecondValue],
                    delimiter: " ; "
                };
                firstLinetext.unshift(hSecondLine);
                /*Première ligne on envoie au composant les auteurs*/
                var hFirstValue = {
                    clazz: "media-creator",
                    codes: [""],
                    key: "creator",
                    text: auteur,
                    values: auteur
                };
                var hFirstLine = {
                    values: [hFirstValue],
                    delimiter: " ; "
                };
                // console.log(firstLinetext);
                firstLinetext.unshift(hFirstLine);
                this.parentCtrl.otherLines = firstLinetext;
            }
            // console.log(this.parentCtrl.otherLines);
            /****************************************************************************** */
            /* Empêche l'affichage des deux champs lds01 det lds02 ans le cas d'une notice fusionnée */
            /****************************************************************************** */
            /*Lorsqu'une notice est fusionnée Primo conserve tous les champs locaux. Ainsi le*/
            /* champ lds01 & lds02 que nous utilisons pour afficher l'adresse bibliographique de la  */
            /*publication est doublé. Ce module ne conserve que le champ construit à partir  */
            /*de la notice Unimarc.*/
            //Test sur la notice fusionnée
            // if (this.parentCtrl.item.context == "L" && this.parentCtrl.item.pnx.control.recordid[0].startsWith('dedup')) {
            //     var firstLinetext = [];
            //     var adresse = this.parentCtrl.item.pnx.display.lds01[0];
            //     /*Seconde ligne on envoie au composant la zone de l'adresse biblio*/
            //     // console.log(auteur);
            //     var hSecondValue = {
            //         clazz: "media-publisher",
            //         codes: [""],
            //         key: "publisher",
            //         text: [adresse],
            //         values: [adresse]
            //     };
            //     var hSecondLine = {
            //         values: [hSecondValue],
            //         delimiter: " ; "
            //     };
            //     firstLinetext.unshift(hSecondLine);
            //     /*Première ligne on envoie au composant les auteurs*/
            //     if(typeof this.parentCtrl.item.pnx.display.lds02 != "undefined"){
            //         var auteur = this.parentCtrl.item.pnx.display.lds02[0];
            //         var hFirstValue = {
            //             clazz: "media-creator",
            //             codes: [""],
            //             key: "creator",
            //             text: [auteur],
            //             values: [auteur]
            //         };
            //         var hFirstLine = {
            //             values: [hFirstValue],
            //             delimiter: " ; "
            //         };
            //         firstLinetext.unshift(hFirstLine);
            //     }
            //     this.parentCtrl.otherLines = firstLinetext;
            // }
    };

    }
}

export let customBriefDisplayConfig = {
    bindings: { parentCtrl: '<' },
    controller: customBriefDisplayController
}