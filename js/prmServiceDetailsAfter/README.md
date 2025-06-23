
## prmServiceDetailsAfter/customFullDisplayRecord : Personnalisation de l'affichage détailllé
### champ "Titre(s) en relation" sur les notices fuisonnées
### Problème
Sur les notices fusionnées **Le champ "Titre(s) en relation"** n'est pas utile. Le lien renvoie vers la même notice dans la majeure partie des cas puisque les notices ont fusionné ou on été regroupées.
### Solution
En cas de fusion des notices supprime le lien vers la notice du document sur un autre support 452 et affiche le message suivant
> Cette notice est issue de la fusion d'une notice de la version imprimée avec la version en ligne du même document. Les informations affichées sont celles de la version imprimée. Voici les références de la version en ligne : Le social à l'épreuve des valeurs, d'un Pays basque à l'autre / Jean-Jacques Manterola - Pessac : Maison des Sciences de l'Homme d'Aquitaine, 2020 - ISBN 978-2-85892-618-3
#### Personnalisation css de l'affichage :
Le conteneur du message utilise la classe ```.alert-bar```.  Par défaut le message prendra donc le format des messages d'alertes affichés dans la vue, comme par exemple le message invitant à s'authentifier. Pour personnalisser ce bloc vous puvez utiliser la classe ```.Rebub_Alerte_Fusion```.

**Structure du bloc** 
```
<div ng-if="$ctrl.is_a_dedup_record_with_relation===true" class="Rebub_Alerte_Fusion bar alert-bar layout-align-center-center" layout-align="center center"role="alert">
    <div class="medium-uppercase-bold text-align-center row flex bold-text">Titre</div>
    <div class="row">Message : <span class="italic-text">Notice liée</span></div>
</div>
```
### Personbalisation du messsage
Le libellé du message peut être changé à partir du Back office de Primo code : 
 - default.fulldisplay.rebubMergeRecordAlertTitle
 - default.fulldisplay.rebubMergeRecordAlertMsg













