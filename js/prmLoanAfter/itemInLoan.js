class itemInLoanController {
    constructor($element, $translate) {
        this.$translate = $translate;
        this.$onInit = function () {
            console.log("--->itemInLoanController");
            console.log(this);
            var loanDate = this.parentCtrl.item.loandate;
            var dueDate = this.parentCtrl.item.duedate;
            var today = new Date();
            var loanDuration = calcDiffDate(formatDate(dueDate), formatDate(loanDate));
            var daysSinceLoanDate = calcDiffDate(today, formatDate(loanDate));
            var institution = this.parentCtrl.item.ilsinstitutioncode;
            console.log(this);
            if (institution != '33PUDB_UB'){
                this.$translate('nui.loans.' + institution + '_duree_prolongation').then((duree_prolongation) => {
                    console.log("Durée de prolongation : " + duree_prolongation);
                    // Si la durée du prêt est supérieure à la durée de la prolongation et si le nombre de jour écoulé depuis la date d'emprunt est inférieure à la durée de la prolongation
                    // Alors on bloque le prêt jusqu'à ce que le nombre de jours d'emprunt écoulés soit égal au nombre de jours de prolongation
                    duree_prolongation = 14
                    if (loanDuration > duree_prolongation && this.parentCtrl.item.renew === "Y" && daysSinceLoanDate < duree_prolongation) {
                        this.parentCtrl.item.renew = "N";
                        $element.parent().children()[0].children[4].innerHTML = newButtonMsg(addDays(formatDate(loanDate), duree_prolongation), this.parentCtrl.loansService.requestParams.lang);
                    }
                    // Si la durée du prêt est inférieure à la durée de la prolongation alors on permet la prolongation 2 jours avant la date d'échéance du prêt.
                    else if (loanDuration <= duree_prolongation && this.parentCtrl.item.renew === "Y") {
                        this.parentCtrl.item.renew = "N";
                        $element.parent().children()[0].children[4].innerHTML = newButtonMsg(addDays(formatDate(dueDate), -2), this.parentCtrl.loansService.requestParams.lang);
                    }

                });
                console.log("Exemplaire emprunté le " + loanDate + ". A rendre le " + dueDate + ".");
                console.log("Exemplaire emprunté le " + formatDate(loanDate) + ". A rendre le " + formatDate(dueDate) + ".");
                console.log("Durée du prêt :" + loanDuration);
                console.log("Date du jour :" + today);
                // Si la durée du prêt est supérieure à 7 jours
            }

            // On vide l'affichage détaillé et on ne conserve que la dated'emprunt 
            this.parentCtrl.item._fullDisplayValues = [{ key: "loan_date", value: this.parentCtrl.item.loandate },
            { key: "max_renew_date", value: this.parentCtrl.item.maxrenewdate }];
            // On vide l'affichage bref de la localisation et la cote Demande UBM 06/2024
            delete this.parentCtrl.item.secondarylocationname;
            delete this.parentCtrl.item.callnumber;    



            function formatDate(date) {
                var regex = /(\d{2})\/(\d{2})\/(\d{4})/;
                var [, day, month, year] = regex.exec(date)
                var formatedDate = new Date(year, month -1, day);
                console.log(formatedDate);
                return formatedDate;
            }
            function calcDiffDate(firstDate, secondDate) {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds    
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                // console.log(diffDays);
                return diffDays
            }
            function addDays(date, days) {
                var result = new Date(date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + days,
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    date.getMilliseconds()
                );
                // console.log("Result : " + result.toLocaleDateString());
                return result.toLocaleDateString();
            }
            function newButtonMsg(renewdateok, lang = 'fr_FR') {
                var msg = {
                    "fr_FR": "Prolongation impossible avant le ",
                    "en_US": "Not renewable before ",
                    "es_ES": "No renovable hasta "
                };
                var fullMsg = msg[lang] + renewdateok;
                var html = '<div class="not-renewable weak-text layout-align-start-center" aria-label="' + fullMsg;
                html = html + ' aria-hidden="false" layout-align="start center"><prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="lock"><!----><md-icon ng-if="!$ctrl.isCustom" md-svg-icon="primo-ui:lock" alt="" class="md-primoExplore-theme" aria-hidden="true"><svg id="lock" width="100%" height="100%" viewBox="0 0 24 24" y="1320" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"></path>   </svg></md-icon><!----><!----><prm-icon-after parent-ctrl="$ctrl"></prm-icon-after></prm-icon><span>';
                html = html + fullMsg + '</span><!----></div><!---->';
                return html;
            }
        };
    }

}
itemInLoanController.$inject = ['$element', '$translate'];
export let itemInLoanConfig = {
    bindings: { parentCtrl: '<' },
    controller: itemInLoanController
}