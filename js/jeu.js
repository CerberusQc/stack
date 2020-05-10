(function($) {
  $.Jeu = class {
    /**
     * Constructeur de jeu
     * @param {string} nomJoueur
     * @param {context} ctx
     */
    constructor(nomJoueur, ctx) {
      this.ctx = ctx;
      this.classement = [];
      this.nouvellePartie(nomJoueur);
      this.termine = false;
      this.secretKey = '';
      this.background = {
        'gif1': [],
        'gif2': [],
        'current': 0,
        'total_frames': 44,
        'total_frames2': 8,
        'width': 800,
        'height': 800,
      };

      for (let i = 0; i < 44; i++) {
        const img = new Image();
        img.src = 'img/gif1/' + i + '.gif';
        this.background.gif1.push(img);
      }
      for (let i = 0; i < 8; i++) {
        const img = new Image();
        img.src = 'img/gif2/' + i + '.gif';
        this.background.gif2.push(img);
      }

      this.cptFrame = 0;
    }

    /**
     * Démarre le jeu
     */
    start() {
      this.ctx.font = '50px Arial Bold';
      this.ctx.textAlign = 'center';
      this.enCours = true;
      this.etage = 0;
    }

    /**
     * Arrête le jeu
     */
    stop() {
      this.enCours = false;
    }

    /**
     * Dessine le jeu
     */
    draw() {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
      this.ctx.fillStyle = this.dernierCube.couleur;
      this.ctx.fillRect(0, 0, canvas.width, 100);
      this.ctx.fillStyle = this.cubeActif.couleur;

      if (20 <= this.etage && this.etage < 40) {
        this.cptFrame = ++this.cptFrame % 5;
        this.ctx.drawImage(this.background.gif1[this.background.current],
            0, 0, 800, 800);

        if (this.cptFrame === 4) {
          this.background.current =
            (this.background.current + 1) % this.background.total_frames;
        }
      } else if (this.etage >= 40) {
        if (this.background.current > 7) {
          this.background.current = 0;
        }
        this.cptFrame = ++this.cptFrame % 5;
        this.ctx.drawImage(this.background.gif2[this.background.current],
            0, 0, 800, 800);

        if (this.cptFrame === 4) {
          this.background.current =
            (this.background.current + 1) % this.background.total_frames2;
        }
      }

      if (this.enCours) {
        const self = this;

        this.pileAvant.removeIf(function(item) {
          return item.action === actions.detruire;
        });
        this.pileArriere.removeIf(function(item) {
          return item.action === actions.detruire;
        });

        this.pileArriere.forEach(function(cube) {
          cube.update(canvas.height);
          cube.draw(self.etage);
        });

        this.pile.forEach(function(cube) {
          cube.draw(self.etage);
        });

        this.cubeActif.update(this.hauteurPile);
        this.cubeActif.draw(this.etage);

        this.pileAvant.forEach(function(cube) {
          cube.update(canvas.height);
          cube.draw(self.etage);
        });

        this.ctx.fillText(this.nom + '\tÉtage : ' + this.etage,
            canvas.width / 2, 65);
        this.verifierCubeActif();
      } else {
        this.afficherClassement();
      }
    }

    /**
     * Retourne la hauteur total de de la pile de cube
     * @return {number}
     */
    sommePile() {
      let somme = 0;
      this.pile.forEach(function(cube) {
        somme += cube.hauteur;
      });

      return somme;
    }

    /**
     * Retire une partie du prochain cube si l'écart entre les deux cubes placés
     * dépasse une certaine marge de manoeuvre
     */
    penaliser() {
      const differenceX = this.cubeActif.positionX - this.dernierCube.positionX;
      const direction = this.directionDernierCube;
      if (Math.abs(differenceX) > 2) {
        const cube = new $.Cube(this.cubeActif.positionX,
            this.cubeActif.positionY, this.cubeActif.couleur, 0, 0,
            directions.static, 5);
        cube.action = actions.animation;

        const diag = Math.hypot(differenceX, differenceX / 2);
        const diffAbs = Math.round(Math.abs(diag));


        if (direction === directions.droiteGauche) {
          if (diffAbs > this.dernierCube.largeurGauche) {
            this.gameover();
          }

          cube.largeurDroite = this.cubeActif.largeurDroite;
          cube.largeurGauche = diffAbs;

          if (differenceX < 0) {
            this.cubeActif.largeurGauche -= diffAbs;
          } else if (differenceX > 0) {
            this.cubeActif.largeurGauche -= diffAbs;
          }
        } else {
          if (diffAbs > this.dernierCube.largeurDroite) {
            this.gameover();
          }

          cube.largeurDroite = diffAbs;
          cube.largeurGauche = this.cubeActif.largeurGauche;

          if (differenceX > 0) {
            this.cubeActif.largeurDroite -= diffAbs;
          } else if (differenceX < 0) {
            this.cubeActif.largeurDroite -= diffAbs;
          }
        }

        if ((differenceX > 0 && direction === directions.droiteGauche) ||
          (differenceX < 0 && direction === directions.gaucheDroite)) {
          this.pileAvant.push(cube);
        } else {
          this.pileArriere.push(cube);
        }
      }
      this.cubeActif.positionX = this.dernierCube.positionX;
      this.cubeActif.positionY = this.dernierCube.positionY - hauteur;
    }

    /**
     * Obtiens la position de départ du dessus de la pile
     * @return {number}
     */
    obtenirDepartY() {
      return canvas.height - this.hauteurPile - canvas.height / 4 + hauteur * 4;
    }

    /**
     * Traite le cube en jeu
     */
    verifierCubeActif() {
      if (this.cubeActif.direction === directions.static) {
        this.pile.push(this.cubeActif);
        this.etage++;
        if (this.etage % 5 === 0) {
          this.vitesse++;
        }
        this.hauteurPile += hauteur;

        this.penaliser();

        this.dernierCube = this.cubeActif;

        if (this.hauteurPile >= 15 * hauteur) {
          this.pile.forEach(function(cube) {
            cube.positionY += hauteur;
          });

          this.hauteurPile -= hauteur;
        }

        if (this.directionDernierCube === directions.droiteGauche) {
          this.directionDernierCube = directions.gaucheDroite;
          this.cubeActif = new $.Cube(departDroite, this.obtenirDepartY(),
              getRandomColor(), this.dernierCube.largeurDroite,
              this.dernierCube.largeurGauche, directions.gaucheDroite,
              this.vitesse);
        } else {
          this.directionDernierCube = directions.droiteGauche;
          this.cubeActif = new $.Cube(departGauche, this.obtenirDepartY(),
              getRandomColor(), this.dernierCube.largeurDroite,
              this.dernierCube.largeurGauche, directions.droiteGauche,
              this.vitesse);
        }
      }
    }

    /**
     * Immobilise le cube en jeu
     */
    dropTheCube() {
      this.cubeActif.dropTheCube();
    }

    /**
     * Met fin à la partie et appelle le script Php
     * Le secretKey sert à éviter la tricherie sous
     * l'environnement de production
     */
    gameover() {
      this.termine = true;
      const text = (this.nom + (this.etage - 1)).secretKey();
      this.secretKey = md5(text);
      this.postAjax();
      this.nouvellePartie(this.nom);
    }

    /**
     * Appelle le script pour mettre à jour le leaderboard
     */
    postAjax() {
      $.ajax({
        method: 'POST',
        context: this,
        url: 'classement.php',
        data: {joueur: this.nom, score: this.etage - 1,
          secretKey: this.secretKey},
        success: function(data) {
          $.classement = data;
        },
        dataType: 'json',
        error: function() {
          return [];
        },
      });
    }

    /**
     * Affiche le classement dans le canevas
     */
    afficherClassement() {
      const ctx = this.ctx;
      const etage = this.etage;

      if (etage <= 20) {
        $.Jeu.dessinerChinois(ctx, -100);
        $.Jeu.dessinerChinois(ctx, 500);
      }

      ctx.fillStyle = etage >= 21 ? getRandomColor() : '#000000';
      ctx.fillText('Votre Score : ' + (this.etage - 1), centreX, 50);
      ctx.fillText('Scoreboard', centreX, 125);
      let cpt = 1;
      $.classement.forEach(function(joueur) {
        ctx.fillStyle = etage >= 21 ? getRandomColor() : '#000000';
        ctx.fillText('#' + cpt + ' - ' + joueur['joueur'] + ' : '
          + joueur['score'], centreX, 135 + (60 * cpt++));
      });
    }

    /**
     * Dessine un chinois malheureux
     * pour les écrans de score en bas de 20 étages
     * @param {context} ctx
     * @param {number} offset
     */
    static dessinerChinois(ctx, offset) {
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'black';
      const largeur = canvas.width / 2;
      const hauteur = canvas.height / 2;

      // Visage
      ctx.beginPath();
      ctx.arc(hauteur / 2+ offset, largeur / 2, hauteur / 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();

      // Chapeau
      ctx.beginPath();
      ctx.fillStyle = 'yellow';
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(largeur / 2 - largeur / 4 + offset,
          hauteur / 2 - hauteur / 5+ 20);
      ctx.lineTo(largeur / 2 + largeur / 4 + offset,
          hauteur / 2 - hauteur / 5+ 20);
      ctx.lineTo(largeur / 2+ offset, hauteur / 2 - hauteur / 3 + 20);
      ctx.lineTo(largeur / 2 - largeur / 4+ offset,
          hauteur / 2 - hauteur / 5+ 20);
      ctx.fill();
      ctx.closePath();

      ctx.strokeStyle = 'blue';
      // Oeil Gauche
      ctx.beginPath();
      ctx.arc(largeur / 2 - largeur / 20+ offset, hauteur / 2 - hauteur / 20,
          hauteur / 20, 0, Math.PI, true);
      ctx.stroke();
      ctx.closePath();

      // Oeil Droit
      ctx.beginPath();
      ctx.arc(largeur / 2 + largeur / 20+ offset, hauteur / 2 - hauteur / 20,
          hauteur / 20, 0, Math.PI, true);
      ctx.stroke();
      ctx.closePath();

      // Bouche
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.arc(largeur / 2+ offset, hauteur / 2 + 50, hauteur / 10,
          0, Math.PI, true);
      ctx.stroke();
      ctx.closePath();
    }

    /**
     * Lance une nouvelle partie avec le nom du joueur
     * @param {string} nomJoueur
     */
    nouvellePartie(nomJoueur) {
      this.nom = nomJoueur;
      this.enCours = false;
      this.vitesse = vitesseInitiale;
      this.directionDernierCube = directions.droiteGauche;
      this.pile = [];
      this.pileAvant = [];
      this.pileArriere = [];

      for (let i = 0; i < 15; i++) {
        this.pile.push(new $.Cube(centreX, canvas.height - hauteur * i,
            getRandomColor(), largeurParDefaut,
            largeurParDefaut, directions.static, 0));
      }

      this.dernierCube = new $.Cube(centreX, canvas.height - hauteur * 15,
          getRandomColor(), largeurParDefaut,
          largeurParDefaut, directions.static, 0);

      this.pile.push(this.dernierCube);
      this.hauteurPile = this.sommePile();

      this.cubeActif = new $.Cube(departGauche, this.obtenirDepartY(),
          getRandomColor(), largeurParDefaut,
          largeurParDefaut, this.directionDernierCube, vitesseInitiale);
    }
  };
})(window.jQuery);
