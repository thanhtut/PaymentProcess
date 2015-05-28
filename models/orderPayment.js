var Mongose = require('mongoose'),
 Schema = Mongose.Schema,
  ObjectId = Schema.ObjectId,
  Db = require('../config/db');

var orderPaymentSchema = new Schema({

  customer_firstname: {
    type: String,
    required: true,
    trim: true
  },
  customer_lastname: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: String
  },
  currency: {
    type: String,
    required: true
  },
  payment_gateway: {
    type: String,
    required: true
  },
  payment_id: {
    type: String,
    required: true
  },
  payment_time: {
    type: Date,
    default: Date.now
  }
});

var OrderPayment = Mongose.model('OrderPayment', orderPaymentSchema);

module.exports = {
  OrderPayment: OrderPayment
};
