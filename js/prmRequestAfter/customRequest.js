import customRequestTemplate from './customRequest.html';

class customRequestController {
    constructor($scope) {
        this.pickupLocationMessage = ''; // Variable pour stocker le message

        this.$onInit = function () {
            console.log('Composant customRequest initialisé');
            console.log('Parent Controller:', this.parentCtrl);
            console.log('Message actuel :', this.pickupLocationMessage);
            this.bibHorsCampus = { 
                '148725310004672$$LIBRARY' : 'Bibliothèque Michel Serres',
                '148724970004672$$LIBRARY': 'Bibliothèque du campus Périgord',
                '148716430004672$$LIBRARY' : 'BU Campus du Pin'
            };


            // Surveiller les changements de valeur du champ mandatory_pickupLocation
            $scope.$watch(
                () => this.parentCtrl.formData['pickupLocation'], 
                (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        this.onPickupLocationChange(newValue);
                    }
                }
            );
        };

        // Méthode pour gérer les changements de valeur
        this.onPickupLocationChange = function (selectedValue) {
            // Liste des locations disponibles
            var locationslist = this.parentCtrl.item.delivery.holding.map(location => location.libraryCode + '$$LIBRARY');
            console.log('LOc :', locationslist);
            console.log('Selected Pickup Location:', selectedValue);
        
            // Vérifier si selectedValue est une clé dans bibHorsCampus
            if (this.bibHorsCampus[selectedValue]) {
                // Vérifier  si selectedValue est absente de locationslist
                if (!locationslist.includes(selectedValue)) {
                    this.pickupLocationMessage = `Veuillez noter que pour tout document ne faisant pas partie des fonds de la ${this.bibHorsCampus[selectedValue]}, un délai additionnel peut être nécessaire pour son transport ou son envoi. Merci de votre compréhension.`;
                    this.openModal(); // Ouvrir la modale
                } else {
                    this.pickupLocationMessage = ''; // Réinitialiser le message si la condition n'est pas remplie
                    this.closeModal(); // Fermer la modale si elle est ouverte
                }
            } else {
                this.pickupLocationMessage = ''; // Réinitialiser le message si selectedValue n'est pas dans bibHorsCampus
            }
        
            console.log('Message affiché :', this.pickupLocationMessage);
        };
        // Méthode pour ouvrir la modale
        this.openModal = function () {
            const modal = document.getElementById('pickupLocationModal');
            if (modal) {
                modal.style.display = 'block';
            }
        };

        // Méthode pour fermer la modale
        this.closeModal = function () {
            const modal = document.getElementById('pickupLocationModal');
            if (modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// Injection des dépendances AngularJS
customRequestController.$inject = ['$scope'];

// Configuration du composant
export let customRequestConfig = {
    bindings: { parentCtrl: '<' },
    controller: customRequestController,
    template: customRequestTemplate
};