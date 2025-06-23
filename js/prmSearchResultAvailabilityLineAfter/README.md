# affDispo
Correction de différents bug liés à l'affichage de la disponibilité dans B+
1. Remonte la deuxième mention de disponibilté qui est parfois non affichée quand pour un même document les notices de la version imprimée et électronique ont été fusionnées. 
Case # 00641786 chez Exlib
2. [Problème consortial] Quand on expose un document électronique local dans la vue d'une institution n'ayant pas accès à ce dernier le document est signalé comme disponible. Aprés avoir testé la non disponibilité du titre pour l'institution on surcharge le code de dispobibilité par le code maison default.delivery.code.does_not_exist_in_maininstitution_local_eressource_33PUDB.
3. [Problème consortial]  Quand une notice n'a plus d'exemplaires ou de portfolios attachés elle n'est pas supprimée dans la zone réseau et reste publiée dans Primo. La section PNX delivery conserve un deliverycode rattaché à l'institution réseau ce qui entraine l'affichage de la mention de disponibilité "Disponible dans un autre établissement du réseau (code default.delivery.code.unavailable_in_maininstitution). Si un résultat est dans ce cas on remplace le code de disponibilité par celui-ci unavailable_in_all_institutions.
4. [06/2024] Dans la recherche de revue la dispo est correctement affichée donc on ne produit pas de disponibilité supplémentaire pour la vue de recherche de revue (balise ```<PRM-JOURNALS>```)
