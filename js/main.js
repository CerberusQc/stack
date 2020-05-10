(function($) {
// Element du Canevas de Jeu
  this.canvas = document.getElementById('jeu');
  canvas.width = 800;
  canvas.height = 800;
  document.body.appendChild(canvas);
  this.ctx = canvas.getContext('2d');


  // Constantes du Jeu
  this.largeurParDefaut = 100;
  this.vitesseInitiale = 1;
  this.centreX = canvas.width / 2;
  this.departGauche = canvas.width / 4;
  this.departDroite = canvas.width / 4 * 3;

  this.hauteur = 25;
  this.directions = Object.freeze({'gaucheDroite': 1, 'droiteGauche': 2,
    'static': 3});
  this.actions = Object.freeze({
    'moving': 1,
    'dropping': 2,
    'landed': 3,
    'transitioning': 4,
    'animation': 5,
    'detruire': 6,
  });
  // Variable Global
  let jeu = null;
  $.classement = [];

  const fps = 60;
  let now;
  let then = Date.now();
  const interval = 1000 / fps;
  let delta;

  /**
   * Lance l'animation sur le canevas
   */
  function draw() {
    requestAnimationFrame(draw);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      if (jeu != null) {
        jeu.draw();
      }
    }
  }

  draw();

  $('#form-user').submit(function(event) {
    event.preventDefault();

    const nom = $('#joueur').val();
    if (2 <= nom.length && nom.length <= 10 && /^[a-zA-Z0-9]+$/.test(nom)) {
      jeu = new $.Jeu(nom, ctx);
      jeu.start();
      document.activeElement.blur();
    } else {
      alert('Pseudo entre 2 et 10 caractères' +
        ' (aucun caractères spéciaux permis)');
    }
  });

  // Trigger Jquery
  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 32 && jeu != null) {
      event.preventDefault();
      jeu.dropTheCube();
    }

    if (event.keyCode === 13 && jeu != null && jeu.enCours === false) {
      event.preventDefault();
      jeu = new $.Jeu(jeu.nom, ctx);
      jeu.start();
    }
  });

  Array.prototype.removeIf = function(callback) {
    let i = this.length;
    while (i--) {
      if (callback(this[i], i)) {
        this.splice(i, 1);
      }
    }
  };

  String.prototype.secretKey = function() {
    let text = this.toString();
    let open = false;

    const devtools = /./;
    devtools.toString = function() {
      open = true;
    };

    console.log('%c', devtools);

    if (jeu.termine === true && !open) {
      text = 'FLAG' + this.toString();
    } else if (open) {
      console.log('TRICHEUR ! Ferme la console si tu veux' +
        ' que ton score soit enregistré !');
    }
    return btoa(text);
  };
})(window.jQuery);

