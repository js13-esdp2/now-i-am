const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Country = new Schema({
  country: String,
  cities: [{
    city: String,
  }],
});

const Countries = mongoose.model('Countries', Country);
module.exports = Countries;