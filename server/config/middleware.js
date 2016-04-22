var bodyParser = require('body-parser');
var path = require('path');

module.exports = function (app, express) {
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../../client/dist')));
};
