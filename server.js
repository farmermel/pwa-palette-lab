const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log('Server running')
});

app.use(bodyParser.json());