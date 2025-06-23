
# dispoElecAutresInst : modifications sur l'affichage détaillé de la notice

## Affichage de la disponibilité des documents électroniques dans les autres institutions du réseau 

On récupère la liste de institutions proposant un accès au document dans la notice pnx via `this.parentCtrl.item.pnx.delivery.delcategory`.

On construit ensuite des liens pour chaque institution. Le clic sur ce lien charge un iframe appelant le résolveur de lien.

Les libellés sont tirés de tables et de codes existants :
 - nui.brief.results.tabs.getit_other
 - delivery.code.restricted


## Empêche l'affichage des deux champs lds01 det lds02 ans le cas d'une notice fusionnée
Lorsqu'une notice est fusionnée Primo conserve tous les champs locaux. Ainsi le champ lds01 & lds02 que nous utilisons pour afficher l'adresse bibliographique de la publication est doublé. Ce module ne conserve que le champ construit à partir  de la notice Unimarc.

## Mise en forme des résultats CDI
Nous utilisons des champs locaux pour alimenter les 2ème (lds02) & 3ème (lds01) lignes du brief display. Les champs Auteurs publisher et partof (pour les articles) utilisés initialement pour la section brief display de l'affichage détaillée ne remontaient plus pour CDI. 
Ce correctif permet de récupérer les champs Pnx et les afficher dans l'affichage abrégé.

## Affichage d'une section "En rayon" alors qu'il n'y a pas de version imprimée du document

### Détail du problème

Dans l'affichage d'une notice détaillée, quand le document ne propose qu'un accès numérique, la section "En rayon" s'affiche quand même. 

Ce problème est lié au fonctionnement de Primo. La vue du catalogue va systématiquement lancer une requête au résolveur de lien pour les notices électroniques (qu'elles soient locales ou de CDI) et elle ne peut pas savoir si cette dernière renverra des résulats. Cet appel au résolveur est réalisé dans une section de l'affichage détaillé baptisée **getit_link2**. 

L'appel au résolveur de lien est utile pour les notices CDI car il permet de remonter des disponibilités en version physique ([comme ici](https://babordplus.hosted.exlibrisgroup.com/primo-explore/fulldisplay?docid=TN_cdi_hal_primary_oai_HAL_hal_01767070v1&context=PC&vid=33PUDB_UB_VU1&lang=fr_FR&search_scope=catalog_pci&adaptor=primo_central_multiple_fe&tab=default_tab&query=any,contains,trail%20running&offset=0)). Mais cette appel est  inutile pour des notices électroniques locales parce que si la notice n'est pas fusionnée, il y a trés peu de chance que le résoveur de lien retrouve des résultats. 

### Solution
Nous proposons de ne pas afficher le service **getit_link2** pour les notices locales décrivant des documents sans aucune  disponibilité en version physique. Bien entendu cela ne résout pas le problème pour les notices CDI. Pour cela il y aurait deux solutions :
 - simplement  supprimer l'affichage du service pour les notices CDI et se passer de la disponibilité de la version physique des documents 
  - lancer une première requête et analyser la réponse avant d'afficher le service au risque de ralentir le chargement du composant angular.

Mais après tout, on peut peut être se contenter de cette solution intermédiaire ? 













