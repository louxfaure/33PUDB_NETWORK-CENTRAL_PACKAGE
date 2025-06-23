# customBriefDisplay

Personnalisation de l'affichage des notices dans la liste des résultats

## Brief Display pour les ressources CDI
Nous utilisons des champs locaux pour alimenter les 2ème & 3ème lignes du brief display. Ces champs permettent de peronnaliser l'affichage en fonction des types de résultat. Ainsi les champs Auteurs & publisher initialement utilisés pour cet affichage ne remonte plus pour CDI. Ce correctif permet de récupérer les champs Pnx et les afficher dans l'affichage abrégé.

## Doublement des champs locaux pour les notices fusionnées
Lorsqu'une notice est fusionnée Primo conserve tous les champs locaux. Ainsi le champ lds01 que nous utilisons pour afficher l'adresse bibliographique de la publication est doublé. Ce module ne conserve que le champ construit à partir de la notice Unimarc.