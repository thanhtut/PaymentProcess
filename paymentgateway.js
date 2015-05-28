 var exports = module.exports = {},
 paypal = require('paypal-rest-sdk'),
 braintree = require('braintree');

 paypal.configure({
   'mode': 'sandbox', //sandbox or live
   'client_id': 'ARpMCKgLk-ADA7hQL9sEDgFrZ7vo4RgnBNZMCHp65PGjyQ_kp6WVYimfPsoKu_o3XsbBrZxBzdpXaUHx',
   'client_secret': 'EA8w3wTOvHVzImrDJH1RX1gE6YU_Z8QpjuF9oQcTu0vLrZUNO_K5xVI3ccFzw1iVXqEF8F8vbT5E4nD6'
 });


 var gateway = braintree.connect({
   environment: braintree.Environment.Sandbox,
   merchantId: "w2p2zyhhdqshy4m7",
   publicKey: "t8q2yr2wqkschwsv",
   privateKey: "e86a8f35f0f0edaea46c8a6acd9a08c6"
 });

 exports.processPayment = function(cardtype, cardnumber, expire_month, expire_year,
   ccv, customer_firstname, customer_lastname, amount, currency, paymentComplete) {
   //console.log("Payment made" + cardtype + currency);
   if (cardtype == 'americanexpress') {
     if (currency == 'USD') {
       payPalPayment(cardtype, cardnumber, expire_month, expire_year,
         ccv, customer_lastname, customer_lastname, amount, currency,paymentComplete);
     } else {
       //Error
       console.log('Invalid payment. American express cards can only take USD');
     }
   }else if (['USD', 'EUR', 'AUD'].indexOf(currency) >= 0) {
     //console.log('USD');
     payPalPayment(cardtype, cardnumber, expire_month, expire_year,
       ccv, customer_firstname, customer_lastname, amount, currency,paymentComplete);
   } else {
     brainTreePayment(cardtype, cardnumber, expire_month, expire_year,
       ccv, customer_firstname, customer_lastname, amount, currency,paymentComplete);
   }
 };

 function payPalPayment(cardtype, cardnumber, expire_month, expire_year,
   ccv, customer_firstname, customer_lastname, amount, currency,paymentComplete) {
   var create_payment_json = {
     "intent": "sale",
     "payer": {
       "payment_method": "credit_card",
       "funding_instruments": [{
         "credit_card": {
           "type": cardtype,
           "number": cardnumber,
           "expire_month": parseInt(expire_month),
           "expire_year": parseInt(expire_year),
           "cvv2": ccv,
           "first_name": customer_firstname,
           "last_name": customer_lastname,
           "billing_address": {
    "line1": "52 N Main ST",
    "city": "Johnstown",
    "state": "OH",
    "postal_code": "43210",
    "country_code": "US"
}
         }
       }]
     },
     "transactions": [{
       "amount": {
         "total": amount,
         "currency": currency
},
"description": "Sandbox testing."     }]
   };
   //console.log(create_payment_json);
   paypal.payment.create(create_payment_json, paymentComplete);

 };


 function brainTreePayment(cardtype, cardnumber, expire_month, expire_year,
   ccv, customer_firstname, customer_lastname, amount, currency,paymentComplete) {


   gateway.transaction.sale({
     amount: amount,
     creditCard: {
       number: cardnumber,
       expirationDate: expire_month + '/' + expire_year.slice(-2)
     }
   }, paymentComplete);
 };




 /*


 */
