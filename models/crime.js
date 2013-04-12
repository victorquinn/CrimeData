
// Crime model
// See http://sanfrancisco.crimespotting.org/api for an example of the data
// this is intended to model.


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
    latitude: String,
    longitude: String,
    created: {type: Date, 'default': Date.now}
  }
);

var Crime = mongoose.model('Crime', CrimeSchema);

module.exports = Crime;
