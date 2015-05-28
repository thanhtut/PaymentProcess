var Lab = require("lab"),
  Code = require('code'),
  lab = exports.lab = Lab.script(),
  cheerio = require('cheerio'),
  server = require("../server.js");
var cookies = '';

lab.experiment("Orders", function() {
  lab.test("Testing order form submission", function(done) {
    var orderFormData = {
      custname: 'John Doe',
      amount: 25,
      currency: 'USD',
      confirm: true
    };


    var options = {
      method: "POST",
      url: "/order",
      payload: orderFormData
    };

    server.inject(options, function(response) {
      var result = response.result;
      //console.log(response);

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(response.headers).to.include('set-cookie'); // test if cookie is set properly
      cookies = response.headers['set-cookie'][0];
      var $ = cheerio.load(response.result);

      Code.expect($("#orderdata").text()).to.include(orderFormData['custname']); //make sure username and current set accordingly
      Code.expect($("#orderdata").text()).to.include(orderFormData['amount'].toString()); //make sure username and current set accordingly
      Code.expect($("#orderdata").text()).to.include(orderFormData['currency']); //make sure username and current set accordingly

      done();
    });
  });

  lab.test("Testing payment processing - braintree", function(done) {

    var paymentFormData = {
      holdername_first: 'John',
      holdername_last: 'Doe',
      cardnumber: '5105105105105100',
      cardtype: 'visa',
      cardexpiration_month: '12',
      cardexpiration_year: '2019',
      cardccv: '874',
      confirm: true,
      amount: 2000,
      currency: 'THB',
    };

    var options = {
      method: "POST",
      url: "/payment",
      payload: paymentFormData,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      var $ = cheerio.load(response.result);

      Code.expect($("#payment-data").text()).to.include("Payment ID"); //make sure username and current set accordingly
      // check for database data insertion
      done();
    });
  });
});



  lab.test("Testing payment processing - paypal", function(done) {

    var paymentFormData = {
      holdername_first: 'John',
      holdername_last: 'Doe',
      cardnumber: '4417119669820331',
      cardtype: 'visa',
      cardexpiration_month: '12',
      cardexpiration_year: '2019',
      cardccv: '874',
      confirm: true,
      amount: 20,
      currency: 'USD',
    };

    var options = {
      method: "POST",
      url: "/payment",
      payload: paymentFormData,
    };

    server.inject(options, function(response) {
      var result = response.result;

      Code.expect(response.statusCode).to.equal(200);
      var $ = cheerio.load(response.result);

      Code.expect($("#payment-data").text()).to.include("Payment ID"); //make sure username and current set accordingly
      // check for database data insertion
      done();
    });


});
