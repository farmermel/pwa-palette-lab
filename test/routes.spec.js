const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('returns html homepage with appropriate elements', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(err => {
      throw err;
    });
  });

  it('returns 404 status for a route that does not exist', () => {
    return chai.request(server)
    .get('/no-plants-here')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(err => {
      throw err;
    });
  });
});

describe('API Routes', () => {
  beforeEach(function(done) {
    database.migrate.rollback()
    .then(function() {
      database.migrate.latest()
      .then(function() {
        return database.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('returns all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('palette_name');
        response.body[0].palette_name.should.equal('Endor');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        response.body[0].should.have.property('palette');
        response.body[0].palette.should.deep.equal([ '#d639a8', '#b0ac19', '#0d2b29', '#377cda', '#adee3b' ]);
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
      });
    });

    it('returns a 404 status if endpoint does not exist', () => {
      return chai.request(server)
      .get('/api/v1/ppppppalettes')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('creates a new palette', () => {
      return chai.request(server)
      .post('/api/v1/palettes')
      .send({
        palette_name: 'Naboo',
        palette: ['1', '2', '3', '4', '5'],
        project_id: 1
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(3);
      });
    });

    it('does not create a palette with missing data', () => {
      return chai.request(server)
      .post('/api/v1/palettes')
      .send({
        palette_name: 'Naboo',
        project_id: 1
      })
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal("Expected format: {palette: <array>, project_id: <number>, palette_name: <string>}. You\'re missing a \"palette\" property.");
      })
      .catch(err => {
        throw err;
      });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    return chai.request(server)
    .delete('/api/v1/palettes/1')
    .then(response => {
      response.should.have.status(204);
    })
    .catch(err => {
      throw err;
    })
  })

  describe('GET /api/v1/projects', () => {
    it('returns all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('project');
        response.body[0].project.should.equal('Yoda');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
      })
      .catch(err => {
        throw err;
      });
    });

    it('returns a 404 status if endpoint does not exist', () => {
      return chai.request(server)
      .get('/api/v1/ppppppprrojects')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
    });
  });

  describe('GET /api/v1/projects/1', () => {
    it('returns project with requested id', () => {
      return chai.request(server)
      .get('/api/v1/projects/1')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('project');
        response.body[0].project.should.equal('Yoda');
        response.body[0].should.have.property('created_at');
        response.body[0].should.have.property('updated_at');
      })
      .catch(err => {
        throw err;
      });
    });

    it('returns a 404 status if id does not exist', () => {
      return chai.request(server)
      .get('/api/v1/projects/4')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      })
    })
  })

  describe('POST /api/v1/projects', () => {
    it('creates a new project', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({
        project: 'Science Fiction'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
      })
      .catch(err => {
        throw err;
      });
    });

    it('does not create a record with missing data', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({})
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal('Expected format: { project: <string> }. You\'re missing a "project" property.')
      })
      .catch(err => {
        throw err;
      })
    })
  });
});