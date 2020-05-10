Auteurs : Bastien Roy-Mazoyer et Frédérick Grégoire

Sommaire : Jeu de Stack en 2D avec perspective

Critères Répondues :
	Form pour le nom avec validation des caractères, lettres et chiffres seulement 2 à 10
	Prevent Default sur le form , lancement du jeu
	Tour de cubes s'affiche, un objet cube sachant se dessiner apparait
	Alternance entre la gauche et la droite
	Aller-retour sur l'axe de déplacement
	La touche espace immobilise le cube
	Changement de couleur après chaque cube
	Mouvement plus rapide à chaque étage
	Étage en cours affiché en haut du canevas
	L'excédent est retiré est descend vers le bas du canevas
	Gameover si pas au dessus de la tour
	Script PHP retourne un fichier json avec les 10 meilleurs joueurs
	Si High Score, le fichier mis a jour avec nom et score du joueur
	Classement affiché dans le canevas
	La touche Enter relance la partie
	ESLint a été passé dans tous nos propres fichiers (pas bootstrap)

Bugs Connus :
	Aucun !

Valeurs ajoutées :
	Le site est en production : http://www.stacktp3.azurewebsites.net
	A partir de l'étage 10, le jeu devient plus difficile, la tour bouge de haut en bas
	A chaque 5 étages, le mouvement de la tour devient plus rapide
	À chaque 20 étages, le background du canevas change pour un gif animé (seulement 2 gifs présentement)
	Des qu'on atteint le niveau 20, tous les cubes changent de couleur 60 fois par seconde ainsi que le scoreboard
	Le scoreboard est différent si < 20 étages
