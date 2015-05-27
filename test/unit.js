var Lab = require("lab"),
  server = require("../server.js")
  var lab = exports.lab = Lab.script();
console.log(Lab);

lab.experiment("Orders", function() {
  lab.test("testing VISA USD", function(done) {
    var orderFormData = {
      custname: 'Jhon Doe',
      amount: 25,
      currency: 'USD'
    };

    var options = {
      method: "GET",
      url: "/order"
    };

    server.inject(options, function(response) {
      var result = response.result;

      Lab.expect(response.statusCode).to.equal(200);
      Lab.expect(result).to.be.instanceof(Array);
      Lab.expect(result).to.have.length(5);

      done();
    });
  });
});
/**
specify('order_test_usd_visa', function(assert){


	var postOrderForm = { uri: "http://localhost:3000/order",method: "POST",form: orderFormData, json: true };
	request(postOrferForm, function (err, resp, body) {
		assert.equal(err,null);
		//Test for proper redirection? and setting of fields

    var paymentFormData = {holdername_first: 'Jhon', holdername_last: 'Doe',
    cardnumber: '4417119669820331', cardtype: 'visa',cardexpiration_month:'12',
     cardexpiration_year:'2018', cardccv: '878'};
     assert.equal(err,null);


	});
});


specify('order_test_thb_visa', function(assert){

  var orderFormData = {custname: 'Jhon Doe', amount: 2500, currency: 'THB'};

	var postOrderForm = { uri: "http://localhost:3000/order",method: "POST",form: orderFormData, json: true };
	request(postOrferForm, function (err, resp, body) {
		assert.equal(err,null);
		//Test for proper redirection? and setting of fields

    var paymentFormData = {holdername_first: 'Jhon', holdername_last: 'Doe',
    cardnumber: '4417119669820331', cardtype: 'visa',cardexpiration_month:'12',
     cardexpiration_year:'2018', cardccv: '878'};
     assert.equal(err,null);


	});
});


specify.run(process.argv.slice(2));
**/
