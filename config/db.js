
var Mongoose = require('mongoose');

//Mongoose.connect(config.database.url);
Mongoose.connect('mongodb://localhost/paymentprocess');
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log("Connection with database succeeded.");
});

exports.Mongoose = Mongoose;
exports.db = db;
