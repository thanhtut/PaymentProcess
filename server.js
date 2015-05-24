var Hapi = require('hapi');
var Path = require("path");
var Handlebars = require('handlebars');

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index',{title: 'Order Form'});
    }
});

server.route({
    method: 'GET',
    path: '/order',
    handler: function (request, reply) {
      reply.view('index',{title: 'Order Form'});
    }
});

server.route({
    method: 'GET',
    path: '/payment',
    handler: function (request, reply) {
      reply.view('payment',{title: 'Payment Form'});
    }
});

server.route({
    method: 'GET',
    path: '/order-confirmation',
    handler: function (request, reply) {
        reply('Submit');
    }
});


server.views({
    engines: {
        html: Handlebars.create()
    },
    path: Path.join(__dirname, 'templates'),
    layoutPath: Path.join(__dirname, 'templates/layout'),
    layout: true
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
