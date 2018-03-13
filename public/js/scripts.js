var rgbToHex = function (rgb) { 
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

const fullColorHex = (r,g,b) => {   
  const red = rgbToHex(r);
  const green = rgbToHex(g);
  const blue = rgbToHex(b);
  return '#'+red+green+blue;
};

const getRandomColor = () => {
  const rgbMax = 255;
  const r = Math.random;
  const round = Math.round;
  return fullColorHex(round(r()*rgbMax), round(r()*rgbMax), round(r()*rgbMax));
}

const generatePalette = () => {
  const color1 = $('.color-1');
  const color2 = $('.color-2');
  const color3 = $('.color-3');
  const color4 = $('.color-4');
  const color5 = $('.color-5');
  const colorDomArr = [color1, color2, color3, color4, color5];

  const colorArr = colorDomArr.forEach( color => {
    const randomColor = getRandomColor();
    color.css('backgroundColor', `${randomColor}`);
    console.log(color.find('.hex'))
    color.find('.hex').text(randomColor)
  })
}

const savePalette = () => {
  console.log('save palette')
}

let color = getRandomColor();


$(document).ready(generatePalette);

