var paymentHandlers = require('../handlers/payment.js');



module.exports = [{
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply.redirect('/order');
    }
  },

  {
    method: 'GET',
    path: '/order',
    handler: paymentHandlers.orderGetHandler
  },

  {
    method: 'POST',
    path: '/order',
    config: paymentHandlers.postOrderConfig
  },

  {
    method: 'GET',
    path: '/payment',
    handler: paymentHandlers.getPaymentHandler
  }, {
    method: 'POST',
    path: '/payment',
    config: paymentHandlers.postPaymentConfig
  }, {
    method: 'GET',
    path: '/order-confirmation',
    handler: function(request, reply) {
      reply('Submit');
    }
  }
];
