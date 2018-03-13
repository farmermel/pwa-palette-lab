$.cssHooks.backgroundColor = {
    get: function(elem) {
        if (elem.currentStyle)
            var bg = elem.currentStyle["backgroundColor"];
        else if (window.getComputedStyle)
            var bg = document.defaultView.getComputedStyle(elem,
                null).getPropertyValue("background-color");
        if (bg.search("rgb") == -1)
            return bg;
        else {
            bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
        }
    }
}

const prependProjectOption = project => {
  console.log(project)
  $('#project-select').prepend(`
    <option value='${project.project}'
            id='${project.id}'>${project.project}</option>
    `);
}

const getColorDivs = () => {
  const color1 = $('.color-1');
  const color2 = $('.color-2');
  const color3 = $('.color-3');
  const color4 = $('.color-4');
  const color5 = $('.color-5');
  return [color1, color2, color3, color4, color5];
}

const getRandomColor = () => {
  const hexOptions = '0123456789abcdef';
  return '#' + hexOptions.split('').map(function(v,i,a){
    return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('');
}

const generatePalette = () => {
  const colorDomArr = getColorDivs();

  const colorArr = colorDomArr.forEach( color => {
    const randomColor = getRandomColor();
    color.css('backgroundColor', `${randomColor}`);
    color.parents().find('.hex').text(randomColor)
  })
}

const createProject = async event => {
  event.preventDefault();
  const projectName = $('#create-project').val();
  const postBody = {
    method: 'POST',
    body: JSON.stringify({ project: projectName }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const initialResponse = await fetch('api/v1/projects', postBody);
    const projectResponse = await initialResponse.json();
    prependProjectOption(projectResponse);
  } catch(error) {
    console.log(error);
  }
}

const getAssociatedProject = () => {
  return $('#project-select').find(':selected')[0].id;
}

const savePalette = async event => {
  event.preventDefault();
  const colorDomArr = getColorDivs();
  const colorArr = colorDomArr.map(color => {
    return color.css('backgroundColor')
  })
  const assocProjectId = getAssociatedProject();
  const postBody = {
    method: 'POST',
    body: JSON.stringify({ palette: colorArr,
                           project_id: assocProjectId }), 
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const initialResponse = await fetch('api/v1/palettes', postBody);
  const paletteResponse = await initialResponse.json();
}

const displayProjects = async () => {
  const initialResponse = await fetch('/api/v1/projects');
  const projects = initialResponse.json();
  
}

$(document).ready(() => {
  generatePalette();
  displayProjects();
});
