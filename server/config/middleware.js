var bodyParser = require('body-parser'),
    request = require('request'),
    express = require('express');


  function applyMiddleware(app) {
    app.use(bodyParser.json());
    var router = express.Router();
    app.set('port', (process.env.PORT || 8000));    
    app.use('/api/company');
    app.use(express.static(path.join(__dirname + '../../dist')));
  }

  module.exports = applyMiddleware;
