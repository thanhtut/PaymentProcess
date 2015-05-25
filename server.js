var Hapi = require('hapi');
var Path = require("path");
var Handlebars = require('handlebars');
var Joi = require('joi');
var server = new Hapi.Server();

server.connection({ port: 3000 });


var orderPostHandler = function(request, reply) {
    //console.log("rawPayload: " + request.rawPayload);
    console.log("Received POST from " + request.payload.holdername + "; confirm=" + request.payload.confirm );

    if (request.payload.confirm) {
        var custname = request.payload.custname;
        var amount = request.payload.amount;
        var currency = request.payload.currency;
    }

    reply.view('payment',{title: 'Payment Form', custname: request.payload.custname,amount: request.payload.amount,currency: request.payload.currency});
};

var postOrderConfig = {
    handler: orderPostHandler,
    validate: {
        payload: {
            custname: Joi.string().min(1).required(),
            amount: Joi.number().min(0.1).max(9999999999),
            currency: Joi.string().min(3).required(),
            confirm: Joi.any().required()
    } }
};


var paymentPostHandler = function(request, reply) {
    //console.log("rawPayload: " + request.rawPayload);

    if (request.payload.confirm) {
        var custname = request.payload.custname;
        var amount = request.payload.amount;
        var currency = request.payload.currency;
    }

    reply.view('order-confirmation',{message: request.payload.cardnumber + request.payload.cardnumber + request.payload.confirm});
};

var postPaymentConfig = {
    handler: paymentPostHandler,
    validate: {
        payload: {
            holdername: Joi.string().min(1).required(),
            cardnumber: Joi.string(19).required(),
            cardexpiration: Joi.string().min(3).required(),
            cardccv: Joi.any().required(),
            confirm:Joi.any().required()
    } }
};

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
      method: 'POST',
      path: '/order',
      config: postOrderConfig
});

server.route({
    method: 'GET',
    path: '/payment',
    handler: function (request, reply) {
      reply.view('payment',{title: 'Payment Form'});
    }
});


server.route({
      method: 'POST',
      path: '/payment',
      config: postPaymentConfig
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
