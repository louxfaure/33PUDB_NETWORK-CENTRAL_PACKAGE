import alertMessageTemplate from './alertMessage.html'
class alertMessageController {
  constructor($translate, $mdToast, $rootScope, $cookies) {
    this.$translate = $translate;
    this.$mdToast = $mdToast;
    this.$rootScope = $rootScope;
    this.$cookies = $cookies;
    console.log(this);
    this.$translate('default.nui.message.annoucement').then((translation) => {
      console.log(translation);
    });
  }

  close (){
    console.log("It's time to kick ass and chew bubble gum, and I'm all outta gum!");
  };
};
alertMessageController.$inject = ['$translate', '$mdToast', '$rootScope', '$cookies'];
// logosInstsController.$inject = ['$http','$element','$sce'];
export let alertMessageConfig = {
    bindings: {parentCtrl:'<'},
    controller: alertMessageController,
    template: alertMessageTemplate
  }
  