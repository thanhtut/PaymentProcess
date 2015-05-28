var Hapi = require('hapi');
var Path = require("path");
var Handlebars = require('handlebars');
var Joi = require('joi');
var server = new Hapi.Server();
var paypal = require('paypal-rest-sdk');
var routes = require('./routes/all');

server.connection({
  port: 3000
});


server.state('orderdata', {
  ttl: 60 * 60 * 1000, //valid for one hour
  path: '/',
  isHttpOnly: true,
  encoding: 'base64json',
  clearInvalid: false, // remove invalid cookies
  strictHeader: true, // don't allow violations of RFC 6265
  sign: {
  password : 'payment'
  }
});




server.route(require('./routes/all'));



server.views({
  engines: {
    html: Handlebars.create()
  },
  path: Path.join(__dirname, 'templates'),
  layoutPath: Path.join(__dirname, 'templates/layout'),
  layout: true
});

server.start(function() {
  console.log('Server running at:', server.info.uri);
});

module.exports = server; // export server for Lab testing
