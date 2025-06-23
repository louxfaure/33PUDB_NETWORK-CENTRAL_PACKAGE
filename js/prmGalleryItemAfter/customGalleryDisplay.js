
class customGalleryDisplayController {
  //Ajoute l'auteur et l'édieur sous la vignette du document.
    constructor($element){
      this.$onInit = function () {
        setTimeout (()=>{
          this.$element = $element;
          // this.$document = $document;
          console.log('---->33PUDB customGalleryDisplayController');
          console.log(this);
          var firstLine = this.parentCtrl.item.pnx.display.lds02 === undefined ? "" : this.parentCtrl.item.pnx.display.lds02;
          var secondLine = this.parentCtrl.item.pnx.display.lds01 === undefined ? "" : this.parentCtrl.item.pnx.display.lds01;
          console.log(this.$element[0].parentElement);
          var conteneur = this.$element[0].parentElement.querySelector('div.item-info');
          var infoExElement = document.createElement('div');
          infoExElement.setAttribute('class','infoEx')
          var firstLineElement = document.createElement('p');
          firstLineElement.setAttribute('class','firstLine');
          firstLineElement.innerText = firstLine;
          infoExElement.appendChild(firstLineElement);
          var secondLineElement = document.createElement('p');
          secondLineElement.setAttribute('class','secondLine');
          secondLineElement.innerText = secondLine;
          infoExElement.appendChild(secondLineElement);
          conteneur.appendChild(infoExElement);
        }, 1000);
      };
    }
  }

  customGalleryDisplayController.$inject = ['$element'];
  
  export let customGalleryDisplayConfig = {
    bindings: {parentCtrl:'<'},
    controller: customGalleryDisplayController,
  }