
/*
 * Crime model
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CrimeSchema = new Schema(
  {
    type: String,
    time: Date,
    description: String,
    case_number: String,
    address: String,
    zip_code: String,
    beat: String,
    accuracy: String,
    lat: String,
    long: String,
    created: {type: Date, 'default': Date.now}
  }
);

var Crime = mongoose.model('Crime', CrimeSchema);

module.exports = Crime;
