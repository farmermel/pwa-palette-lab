const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.set('port', process.env.PORT || 3000);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log('Server running')
});

app.locals.palettes = [];
app.locals.projects = [];

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now();
  const { palette, project_id } = request.body;

  app.locals.palettes.push({ id, palette, project_id });
  response.status(201).json({ id, palette, project_id });
})

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now();
  const { project } = request.body;

  app.locals.projects.push({ id, project });
  response.status(201).json({ id, project });
})

app.get('/api/v1/projects', (request, response) => {
  const { projects } = app.locals;

  response.status(200).json(projects);
})

//get saved projects/palettes on page load
//get that project and all palettes in it on save palette to project

//post new project, return new proj in body for display
//post new palette, spread into old and return whole project
