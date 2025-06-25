
/*[33PUDB_NETWORK_AFA] - Customisation de la toplevel facette  */
/*Suprime les entrées 'peer_reviewed','open_access'et'available'*/
class tLevelFacetteController {
  constructor($scope){
    this.$onInit = function () {
      console.log("tLevelFacetteController initialized");

      var parent_ctrl = $scope.$parent.$parent.$ctrl;
      this.facet_group = parent_ctrl.facetGroup.name;
      this.facet_results = parent_ctrl.facetGroup.values;
      if (this.facet_group == 'tlevel') {
        console.log("tLevelFacetteController tlevel_parent_ctrl", parent_ctrl);
        this.processFacets();
      }

    }

    this.processFacets = function () {
      var self = this;
      angular.forEach(self.facet_results, function (result) {
        console.log("tLevelFacetteController result", result);
        if (result.name == 'tlevel') {
          var first_value = result.value;
          var interval = setInterval(find_facet, 100);
          function find_facet() {
            if (document.querySelector(self.getSelector(first_value))) {
              console.log("tLevelFacetteController find_facet", first_value);

              // Clear interval
              clearInterval(interval);

              // Add availability counts as spans
                var selector = self.getSelector(first_value);
                if (document.querySelector(selector)) {
                  var facet_item = document.querySelector(selector);
                  if (facet_item.querySelector('.facet-counter') == null) {
                    console.log("tLevelFacetteController facet_item", facet_item);
                    var facet_text = facet_item.querySelector('.text-number-space');
                    var span = document.createElement('span');
                    var count = document.createTextNode(result.count.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                    span.setAttribute('class', 'text-italic text-in-brackets text-rtl facet-counter');
                    span.appendChild(count);
                    facet_text.after(span);
                  }
                }

              // Facets are created and destroyed in the DOM when the group is toggled so watch for clicks
              var availGroup = document.querySelector(self.getSelector('tlevel'));
              availGroup.addEventListener('click', function () {
                self.processFacets();
              });
            }
          }
        }
      });
    }

    this.getSelector = function (value) {
      if (value == 'tlevel') {
        return 'div[data-facet-group="tlevel"]';
      }
      else {
        return 'div[data-facet-value="tlevel-' + value + '"]';
      }
    }

  }

  get recordid() {
    return this.parentCtrl.item.pnx.control.recordid[0];
  }
}

tLevelFacetteController.$inject = ['$scope'];

export let tLevelFacetteConfig = {
  bindings: {parentCtrl:'<'},
  controller: tLevelFacetteController
}
