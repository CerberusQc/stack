(function($) {
  $.Cube = class {
    /**
     * Constructeur de cube
     * @param {number} departX
     * @param {number} departY
     * @param {string} couleur
     * @param {number} largeurD
     * @param {number} largeurG
     * @param {string} direction
     * @param {number} vitesse
     */
    constructor(departX, departY, couleur, largeurD, largeurG, direction,
        vitesse) {
      this.positionX = departX;
      this.positionY = departY;
      this.hauteur = hauteur;
      this.couleur = couleur;
      this.largeurDroite = largeurD;
      this.largeurGauche = largeurG;
      this.direction = direction;
      this.vitesse = vitesse;
      this.action = actions.moving;
    }

    /**
     * Modifie le comportement du cube
     * @param {number} hauteurPile
     */
    update(hauteurPile) {
      if (this.action === actions.animation) {
        this.animationTomber();

        if (this.positionY >= canvas.height + 200) {
          this.action = actions.detruire;
        }
      } else {
        if (this.action === actions.moving) {
          if (this.direction === directions.droiteGauche) {
            this.droiteGauche();
          } else if (this.direction === directions.gaucheDroite) {
            this.gaucheDroite();
          }
        } else if (this.action === actions.dropping) {
          this.dropTheCube();

          if (this.positionY >= canvas.height - hauteurPile) {
            this.action = actions.landed;
            this.direction = directions.static;
          }
        }

        if (this.positionX > departDroite || this.positionX < departGauche) {
          this.vitesse = -this.vitesse;
        }
      }
    }

    /**
     * Dessine le cube et son <<wobble>> selon le score de l'usager
     * @param {number} score
     */
    draw(score) {
      const wobbleFactor = score >= 20 ? 3 :
        score >= 15 ? 2 : score >= 10 ? 1 : 0;
      const wobble = wobbleFactor === 0 ? 0 :
        Math.sin(Date.now() / (250 / wobbleFactor)) *
        window.innerHeight / (50 / wobbleFactor);
      const x = this.positionX;
      const y = this.positionY + wobble;
      const wx = this.largeurGauche;
      const wy = this.largeurDroite;
      const h = this.hauteur;
      const color = score >= 20 ? getRandomColor() : this.couleur;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - wx, y - wx * 0.5);
      ctx.lineTo(x - wx, y - h - wx * 0.5);
      ctx.lineTo(x, y - h);
      ctx.closePath();
      ctx.fillStyle = shadeColor(color, -10);
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + wy, y - wy * 0.5);
      ctx.lineTo(x + wy, y - h - wy * 0.5);
      ctx.lineTo(x, y - h);
      ctx.closePath();
      ctx.fillStyle = shadeColor(color, 10);
      ctx.strokeStyle = shadeColor(color, 50);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y - h);
      ctx.lineTo(x - wx, y - h - wx * 0.5);
      ctx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
      ctx.lineTo(x + wy, y - h - wy * 0.5);
      ctx.closePath();
      ctx.fillStyle = shadeColor(color, 20);
      ctx.strokeStyle = shadeColor(color, 60);
      ctx.stroke();
      ctx.fill();
    }

    /**
     * Déplace le cube de droite à gauche
     */
    droiteGauche() {
      this.positionY += this.vitesse * 0.5;
      this.positionX += this.vitesse;
    }

    /**
     * Déplace le cube de gauche à droite
     */
    gaucheDroite() {
      this.positionY -= this.vitesse * 0.5;
      this.positionX += this.vitesse;
    }

    /**
     * Immobilise le cube
     */
    dropTheCube() {
      this.action = actions.landed;
      this.direction = directions.static;
    }

    /**
     * Descend l'excédent du cube
     */
    animationTomber() {
      this.positionY += this.vitesse;
    }
  };
})(window.jQuery);
