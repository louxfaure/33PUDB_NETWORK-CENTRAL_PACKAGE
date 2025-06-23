

import customFullDisplayRecordHTML from './customFullDisplayRecord.html'
class customFullDisplayRecordController {
  constructor($element, $translate) {
    this.$translate = $translate;
    this.$element = $element;
    this.$onInit = function () {
      console.log("customFullDisplayRecord");
      // console.log(this.parentCtrl);
      // console.log(this.parentCtrl.item);
      // console.log(this.$element.parent());
      // [AFA 20240622 ] Lorsqu'une notice est fusionnée, empêche l'affichage de la 452 et génère une note d'information
      this.is_a_dedup_record_with_relation = false;
      // Si la notice est locale et résulte d'une fusion
      if(this.parentCtrl.item.context == "L" && this.parentCtrl.item.pnx.control.recordid[0].startsWith('dedup')){
        // Parcour la liste des relations
        for (var i = 0; i < this.parentCtrl.item.pnx.display.relation.length; i++) {
          // Si ma realtion est portée par une 452
          if (this.parentCtrl.item.pnx.display.relation[i].startsWith('$$C452_label')){
            // Construit la mention de l'autre édition.
            var rx = /\$\$V(.*?)\$/g;
            var arr = rx.exec(this.parentCtrl.item.pnx.display.relation[i]);
            this.autre_ed = arr[1];
            this.is_a_dedup_record_with_relation = true; 
            // Supprime de l'affichage la mention du lien
            this.parentCtrl.item.pnx.display.relation.splice(i, 1); 
            i--;
          }
          console.log(this.parentCtrl.item.pnx.display.relation[i]);
        }

      }
      


    };
  }

}
customFullDisplayRecordController.$inject = ['$element', '$translate'];

export let customFullDisplayRecordConfig = {
  bindings: { parentCtrl: '<' },
  controller: customFullDisplayRecordController,
  template: customFullDisplayRecordHTML
}