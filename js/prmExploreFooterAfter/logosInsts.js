
import logosInstsTemplate from './logosInsts.html'

class logosInstsController {
    constructor(){
      this.$onInit = function () {
        console.log("Custom footer started");
        var url = new URL(document.location.href);
        var displayFooter = url.searchParams.get('displayFooter');
        this.institutionsList = [
          {'code':'BXSA',
            'name':'Babord + Bordeaux Sciences Agro',
          },
          {'code':'IEP',
            'name':'Babord + Sciences Po Bordeaux',
          },
          {'code':'INP',
            'name':'Babord + Institut National Polytechnique de Bordeaux',
          },
          {'code':'UB',
            'name':'Babord + Université de Bordeaux',
          },
          {'code':'UBM',
            'name':'Babord + Université Bordeaux Montaigne',
          }
        ];
        this.institutionsUrl = {};
        this.displayFooter = true;
        if (displayFooter == 'false'){
          this.displayFooter = false;
        }
        console.log(this.parentCtrl);
        this.institutionsList.forEach((institution)=>{
          console.log(institution['code']);
          let modifiedHostname = url.hostname;
          console.log(modifiedHostname);
          if (modifiedHostname.startsWith('pudb-')) {
              modifiedHostname = 'https://pudb-'+ institution['code'].toLowerCase() +'.primo.exlibrisgroup.com';
          }
          console.log(modifiedHostname);
          institution['url'] = modifiedHostname + '/discovery/search?vid=33PUDB_' + institution['code'] + ":33PUDB_" +institution['code'] + '_VU1';
        });
        this.message = "Réseau des bibliothèques universitaires bordelaises";    
        console.log(this.institutionsList);        
        this.institutionsList.sort();
        console.log("Custom footer finished");
    };


  }
};
// logosInstsController.$inject = ['$http','$element','$sce'];
export let logosInstsConfig = {
    bindings: {parentCtrl:'<'},
    controller: logosInstsController,
    template:logosInstsTemplate
  }
  