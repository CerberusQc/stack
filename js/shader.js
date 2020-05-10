// Colour adjustment function
// Nicked from http://stackoverflow.com/questions/5560248
/**
 * Applique une teinte à la couleur
 * @param {number} color
 * @param {number} percent
 * @return {string}
 */
function shadeColor(color, percent) {
  color = color.substr(1);
  const num = parseInt(color, 16);


  const amt = Math.round(2.55 * percent);


  const R = (num >> 16) + amt;


  const G = (num >> 8 & 0x00FF) + amt;


  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
}

/**
 * Retourne une couleur aléatoire sous le format Hexadécimal
 * @return {string}
 */
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
