const randomColor = () => {
  const rgbMax = 255;
  const r = Math.random;
  const round = Math.round;
  return `rgb(${round(r()*rgbMax)}, ${round(r()*rgbMax)}, ${round(r()*rgbMax)})`;
}

const generatePalette = () => {
  const color1 = $('.color-1');
  const color2 = $('.color-2');
  const color3 = $('.color-3');
  const color4 = $('.color-4');
  const color5 = $('.color-5');
  const colorDomArr = [color1, color2, color3, color4, color5];

  const colorArr = colorDomArr.map( color => {
    console.log(color)
    return color.css('backgroundColor', `${randomColor()}`);
  })
  console.log(colorArr);

}

let color = randomColor();
console.log(color)
