import customToastTemplate from './customToast.html';

class PrmTopbarAfterController {
  constructor($scope, $element, $translate, $window) {
    console.log("PrmTopbarAfterController constructor called");
    this.$scope = $scope;
    this.$element = $element;
    this.$translate = $translate;
    this.$window = $window;

    console.log("PrmTopbarAfterController initialized");

    // Initialisez hideAttentionMessage si nécessaire
    if (sessionStorage.getItem('hideAttentionMessage') === null) {
      console.log("hideAttentionMessage is null, initializing to false");
      sessionStorage.setItem('hideAttentionMessage', 'false');
    }

    // Vérifiez si le message a déjà été masqué pendant la session
    if (!this.isMessageDismissed()) {
      this.loadToastTemplate().then(() => {
        this.showAttentionToast();
      });
    }
  }

  // Vérifie si le message a été masqué
  isMessageDismissed() {
    const value = sessionStorage.getItem('hideAttentionMessage');
    console.log("isMessageDismissed value:", value);
    return value === 'true';
  }

  // Charge le template HTML du toast
  loadToastTemplate() {
    return new Promise((resolve, reject) => {
      const toastContainer = document.createElement('div');
      toastContainer.innerHTML = customToastTemplate;
      document.body.appendChild(toastContainer);
      resolve();
    });
  }

  // Méthode pour afficher le toast
  showAttentionToast() {
    const currentUrl = this.$window.location.href;
    const newDomain = 'https://new-domain.com'; // Remplacez par le nouveau domaine
    const redirectUrl = currentUrl.replace(this.$window.location.origin, newDomain);

    // Configure le toast
    const toast = document.getElementById('custom-toast');
    const messageElement = document.getElementById('custom-toast-message');
    const linkElement = document.getElementById('custom-toast-link');
    const closeButton = document.getElementById('custom-toast-close');

    messageElement.textContent = 'Attention, vous êtes sur un site temporaire. Cliquez ici pour accéder au site principal.';
    linkElement.href = redirectUrl;

    // Affiche le toast
    toast.style.display = 'block';

    // Ajoute un gestionnaire pour fermer le toast
    closeButton.addEventListener('click', () => {
      toast.style.display = 'none';
      sessionStorage.setItem('hideAttentionMessage', 'true');
    });
  }
}

PrmTopbarAfterController.$inject = ['$scope', '$element', '$translate', '$window'];

export let prmTopbarAfterConfig = {
  controller: PrmTopbarAfterController,
  bindings: { parentCtrl: '<' },
};