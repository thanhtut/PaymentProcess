var Hapi = require('hapi');
var Path = require("path");
var Handlebars = require('handlebars');
var Joi = require('joi');
var server = new Hapi.Server();
var paypal = require('paypal-rest-sdk');

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

var orderGetHandler = function(request, reply) {
  reply.view('index', {
    title: 'Order Form'
  })
};

var orderPostHandler = function(request, reply) {
  //console.log("rawPayload: " + request.rawPayload);
  console.log("Received POST from " + request.payload.holdername + "; confirm=" + request.payload.confirm);

  if (request.payload.confirm) {
    var custname = request.payload.custname;
    var amount = request.payload.amount;
    var currency = request.payload.currency;
  }

  reply.view('payment', {
    title: 'Payment Form',
    custname: request.payload.custname,
    amount: request.payload.amount,
    currency: request.payload.currency
  }).state('orderdata', {
    custname: request.payload.custname,
    amount: request.payload.amount,
    currency: request.payload.currency
  });
};

var postOrderConfig = {
  handler: orderPostHandler,
  validate: {
    payload: {
      custname: Joi.string().min(1).required(),
      amount: Joi.number().min(0.1).max(9999999999),
      currency: Joi.string().min(3).required(),
      confirm: Joi.any().required()
    }
  }
};


var getPaymentHandler = function(request, reply) {
  //check if order form has been filled
  var orderdata = request.state.orderdata;
  if (!orderdata) {
    //redirect back to order form.
    reply.redirect('/order');
  } else {

    reply.view('payment', {
      title: 'Payment Form'
    });
  }
};

var paymentPostHandler = function(request, reply) {

  var orderdata = request.state.orderdata;
  if (!orderdata) {
    //redirect back to order form.
    reply.redirect('/order');
  }


  //console.log("rawPayload: " + request.rawPayload);
  var cardtype = request.payload.cardtype;
  var cardnumber = request.payload.cardnumber;
  var expire_month = request.payload.cardexpiration;
  var expire_year = request.payload.cardexpiration;
  var ccv = request.payload.ccv;
  var first_name = request.payload.holdername_first;
  var last_name = request.payload.holdername_last;
  var amount = request.state.orderdata.amount;
  var currency = request.state.orderdata.currency;

  //var currency = request.payload.currency;

  var paymentgateway = require("./paymentgateway.js");
  paymentgateway.processPayment(cardtype, cardnumber, expire_month, expire_year,
    ccv, first_name, last_name, amount, currency);
  reply.view('order-confirmation', {
    message: request.payload.cardnumber + request.payload.confirm
  });
};

var postPaymentConfig = {
  handler: paymentPostHandler,
  validate: {
    payload: {
      holdername_first: Joi.string().min(1).required(),
      holdername_last: Joi.string().min(1).required(),
      cardnumber: Joi.string(16).required(),
      cardtype: Joi.string().required(),
      cardexpiration_month: Joi.string().min(2).required(),
      cardexpiration_year: Joi.string().min(4).required(),
      cardccv: Joi.string().min(3).max(4).required(),
      confirm: Joi.any().required()
    }
  }
};

server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply.redirect('/order');
  }
});

server.route({
  method: 'GET',
  path: '/order',
  handler: orderGetHandler
});

server.route({
  method: 'POST',
  path: '/order',
  config: postOrderConfig
});

server.route({
  method: 'GET',
  path: '/payment',
  handler: getPaymentHandler
});


server.route({
  method: 'POST',
  path: '/payment',
  config: postPaymentConfig
});


server.route({
  method: 'GET',
  path: '/order-confirmation',
  handler: function(request, reply) {
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

server.start(function() {
  console.log('Server running at:', server.info.uri);
});
