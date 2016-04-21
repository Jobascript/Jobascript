var express = require('express');
var app = express();
var middleware = require('./middleware');

middleware(app);
