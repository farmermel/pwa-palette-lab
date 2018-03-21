const toggleLocked = event => {
  $(event.target).toggleClass('image-locked');
  $(event.target).toggleClass('lock');
  $(event.target).parent().siblings('.color-div').toggleClass('locked');
}

const renderProjectSelect = projects => {
  projects.forEach( project => {
    $('#project-select').prepend(`
    <option value='${project.project}'
            id='${project.id}'>${project.project}</option>
    `);
  })
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
  const hexOptionsArr = hexOptions.split('');
  const hexArr = [];
  for (let i = 0; i < 6; i++) {
    hexArr.push(hexOptionsArr[Math.floor(Math.random()*16)]);
  }
  return '#' + hexArr.join('');
}

const renderNewPalette = colorDomArr => {
  let randomColor;
  const colorArr = colorDomArr.forEach( color => {
    if( color.hasClass('locked') ) {
      color.css('fill')
    } else {
      randomColor = getRandomColor();
      color.css('fill', `${randomColor}`);
      color.siblings('.swatch-bottom-wrap').find('.hex').text(randomColor);
    }
  })
} 

const generatePalette = () => {
  const colorDomArr = getColorDivs();
  renderNewPalette(colorDomArr);
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
    const initialPostResponse = await fetch('api/v1/projects', postBody);
    const projectId = await initialPostResponse.json();
    const initialGetResponse = await fetch(`api/v1/projects/${projectId.id}`);
    const project = await initialGetResponse.json();
    renderProjectSelect(project);
    const paletteProjectObject = await getAllPalettesAndProjects();
    renderProjects(paletteProjectObject.projects, paletteProjectObject.palettes);
    $('#create-project').val('');
  } catch(error) {
    console.log(error);
  }
}

const getAllPalettesAndProjects = async () => {
  const initialProjResponse = await fetch('/api/v1/projects');
  const initialPaletteResponse = await fetch('/api/v1/palettes');
  const projects = await initialProjResponse.json();
  const palettes = await initialPaletteResponse.json();
  return {
    projects,
    palettes
  }
}

const getAssociatedProject = () => {
  return $('#project-select').find(':selected')[0].id;
}

const savePalette = async event => {
  event.preventDefault();
  const colorDomArr = getColorDivs();
  const colorArr = colorDomArr.map(color => {
    return color.css('fill')
  })
  const assocProjectId = getAssociatedProject();
  const paletteName = $('.palette-name-input').val();
  const postBody = {
    method: 'POST',
    body: JSON.stringify({ palette: colorArr,
                           project_id: assocProjectId,
                           palette_name: paletteName }), 
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const initialResponse = await fetch('api/v1/palettes', postBody);
  const paletteResponse = await initialResponse.json();
  const paletteProjectObject = await getAllPalettesAndProjects();
  renderProjects(paletteProjectObject.projects, paletteProjectObject.palettes);
  $('.palette-name-input').val('');
}

const displayColors = colorArr => {
  return colorArr.map( color => {
    return (`
      <div class='color-circle' style='background-color:${color}'></div>
    `)
  }).join('');
}

const deletePalette = async event => {
  const idClass = $(event.target)
    .parent('.palette-wrap')
    .attr('class')
    .split(' ')
    .find( klass =>  { 
      return klass.includes('paletteId')})
  const paletteId = idClass.split('-')[1];
  const initialResponse = await fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'delete'
  });
  $(`.${idClass}`).remove();
}

const renderPalettes = (projectId, palettes) => {
  const matchPalettes = palettes.filter( palette => {
    return palette.project_id === projectId;
  })
  return matchPalettes.map( palette => {
    return (`
      <article class='palette-wrap paletteId-${palette.id}'>
        <h4 class='palette-name'>${palette.palette_name}</h4>
        <div class='color-circle-wrap'>${displayColors(palette.palette)}</div>
        <img src='/assets/trash.svg' 
             alt='trash'
             class='trash'
             onclick='deletePalette(event)' />
      </article>
    `)
  }).join('');
}

const renderProjects = (projects, palettes) => {
  const alternative = 'No palettes in this project yet!';
  const projectsToRender = projects.map( project => {
    return (`
      <article>
        <h2>${ project.project }</h2>
        <div>${ renderPalettes(project.id, palettes) || alternative }</div>
      </article>
    `)
  })
  $('.projects-wrap').empty();
  $('.projects-wrap').append(projectsToRender);
}

const displayProjects = async () => {
  try {
    const paletteProjectObject = await getAllPalettesAndProjects();
    renderProjects(paletteProjectObject.projects, paletteProjectObject.palettes);
    renderProjectSelect(paletteProjectObject.projects);
  } catch (error) {
    console.log(error);
  }
}


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../service-worker.js')
      .then(reg => {
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        console.log(`ServiceWorker registration failed: ${err}`);
      });
  });
}

$(document).ready(() => {
  generatePalette();
  displayProjects();
});
