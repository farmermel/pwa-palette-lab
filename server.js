const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
app.set('port', process.env.PORT || 3000);

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log('Server running')
});

app.locals.palettes = [{id: 1520974039791, palette_name: "Endor", palette: ["#d639a8", "#b0ac19", "#0d2b29", "#377cda", "#adee3b"], project_id: "1520974035795"},
                       {id: 1520974032000, palette_name: "Camp", palette: ["#1a7bc2", "#249A91", "#64eda6", "#237cda", "#adee3b"], project_id: "1520974035795"},
                       {id: 1520300002000, palette_name: "Camp", palette: ["#bd5cb8", "#0a8dcb", "#007ef3", "#2f22ca", "#3ebd57"], project_id: "87"}];
app.locals.projects = [{id: 1520974035795, project: "Yoda"}, {id: 87, project: 'Forest'}];

app.get('/api/v1/palettes', (request, response) => {
  // const { palettes } = app.locals;
  database('palettes').select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now();
  const { palette, project_id } = request.body;

  app.locals.palettes.push({ id, palette, project_id });
  response.status(201).json({ id, palette, project_id });
})

app.get('/api/v1/projects', (request, response) => {
  // const { projects } = app.locals;
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  // response.status(200).json(projects);
});

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now();
  const { project } = request.body;

  app.locals.projects.push({ id, project });
  response.status(201).json({ id, project });
})


//get saved projects/palettes on page load
//get that project and all palettes in it on save palette to project

//post new project, return new proj in body for display
//post new palette, spread into old and return whole project
