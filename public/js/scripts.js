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
  return '#' + hexOptions.split('').map(function(v,i,a){
    return i>5 ? null : a[Math.floor(Math.random()*16)] }).join('');
}

const renderNewPalette = colorDomArr => {
  let randomColor;
  const colorArr = colorDomArr.forEach( color => {
    if( color.hasClass('locked') ) {
      color.css('backgroundColor')
    } else {
      randomColor = getRandomColor();
      color.css('backgroundColor', `${randomColor}`);
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
    $('#create-project').val('');
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
  const paletteName = $('.palette-name').val();
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
}

const displayColors = colorArr => {
  return colorArr.map( color => {
    return (`
      <div class='color-circle' style='background-color:${color}'></div>
    `)
  }).join('');
}

const renderPalettes = (projectId, palettes) => {
  const matchPalettes = palettes.filter( palette => {
    return parseInt(palette.project_id) === projectId;
  })
  return matchPalettes.map( palette => {
    return (`
      <article class="palette-wrap">
        <h4>${palette.palette_name}</h4>
        <div class='color-circle-wrap'>${displayColors(palette.palette)}</div>
        <img src="/assets/trash.svg" 
             alt="trash"
             class="trash" />
      </article>
    `)
  }).join('');
}

const renderProjects = (projects, palettes) => {
  const projectsToRender = projects.map( project => {
    return (`
      <article>
        <h3>${ project.project }</h3>
        <div>${ renderPalettes(project.id, palettes) }</div>
      </article>
    `)
  })
  $('.projects-wrap').append(projectsToRender);
}

// const renderProjectSelect = projects => {
//   console.log(projects)
//   //refactor later to use prependProjectOption
//   projects.forEach( project => {

//     $('#project-select').prepend(`
//     <option value='${project.project}'
//             id='${project.id}'>${project.project}</option>
//     `);
//   })
// }

const displayProjects = async () => {
  try {
    const initialProjResponse = await fetch('/api/v1/projects');
    const initialPaletteResponse = await fetch('/api/v1/palettes');
    const projects = await initialProjResponse.json();
    const palettes = await initialPaletteResponse.json();
    renderProjects(projects, palettes);
    renderProjectSelect(projects);
  } catch (error) {
    console.log(error);
  }


}

$(document).ready(() => {
  generatePalette();
  displayProjects();
});
