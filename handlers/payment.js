var payment = module.exports = {};
var Joi = require('joi'),
  OrderPayment = require('../models/orderPayment').OrderPayment,
  Db = require('../config/db');

payment.orderGetHandler = function(request, reply) {
  reply.view('index', {
    title: 'Order Form'
  })
};

var orderPostHandler = function(request, reply) {
  //console.log("rawPayload: " + request.rawPayload);

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

payment.postOrderConfig = {
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


payment.getPaymentHandler = function(request, reply) {
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
  if (!orderdata & !request.payload.amount) {
    //redirect back to order form.
    reply.redirect('/order');
  }

  //console.log("rawPayload: " + request.rawPayload);
  var cardtype = request.payload.cardtype;
  var cardnumber = request.payload.cardnumber;
  var expire_month = request.payload.cardexpiration_month;
  var expire_year = request.payload.cardexpiration_year;
  var ccv = request.payload.ccv;
  var first_name = request.payload.holdername_first;
  var last_name = request.payload.holdername_last;
  if (request.payload.amount) {
    var amount = request.payload.amount;
    var currency = request.payload.currency;
  } else { // used for unit testing.
    var amount = request.state.orderdata.amount;
    var currency = request.state.orderdata.currency;
  }
  //var currency = request.payload.currency;

  var paymentgateway = require("../paymentgateway.js");
  var paymentComplete = function(error, payment) {
    if (error) {
      reply.view('order-confirmation', {
        error: error.toString()
      });
      console.log(error);

    } else {
      //console.log(payment);

      if (payment.transaction.id) { // braintree payment
        savePaymentDetails(first_name, last_name, amount, currency,
          'braintree', payment.transaction.id);

        reply.view('order-confirmation', {
          payment_gateway: 'Braintree',
          amount: amount,
          payment_id: payment.transaction.id,
          payment_date: new Date()
        });
      } else {
        savePaymentDetails(first_name, last_name, amount, currency,
          'paypal', payment.id);

        reply.view('order-confirmation', {
          payment_gateway: 'Braintree',
          amount: amount,
          payment_id: payment.id,
          payment_date: new Date()
        });

      }

    }
  }


  paymentgateway.processPayment(cardtype, cardnumber, expire_month, expire_year,
    ccv, first_name, last_name, amount, currency, paymentComplete);
  //do some callback stuff
};

payment.postPaymentConfig = {
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
      confirm: Joi.any().required(),
      amount: Joi.any(),
      currency: Joi.any()
    }
  }
};



//refactor movie it
function savePaymentDetails(customer_firstname, customer_lastname, price, currency, payment_gateway, payment_id) {
  var payment = new OrderPayment({
    customer_firstname: customer_firstname,
    customer_lastname: customer_lastname,
    price: price,
    currency: currency,
    payment_gateway: payment_gateway,
    payment_id: payment_id
  });
  payment.save(function(err, payment) {
    if (err) {
      //report error
      //console.log('saved failed');
      console.log(err);
    }
  });
};
