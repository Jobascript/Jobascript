var comm = angular.module('jobascript.comm', ['jobascript.company']);

comm.config(require('./routes.js'));

comm.controller('CommController', require('./controller.js'));
comm.factory('Comm', require('./services.js'));

module.exports = comm;
