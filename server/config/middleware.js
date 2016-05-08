var bodyParser = require('body-parser');
var path = require('path');
var expressjwt = require('express-jwt');

var SECRET = 'CrazyPrivateKey';

module.exports = function (app, express) {
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.use('/api', function (req, res, next) {
    console.log('middle >>> ', req.headers);
    if (req.headers.authorization) {
      expressjwt({ secret: SECRET })(req, res, next);
    } else {
      next();
    }
  });
};
