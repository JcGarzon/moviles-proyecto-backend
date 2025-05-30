const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  population: { type: Number, required: true },
  imageUrl: { type: String, required: false } // New field for image URL
});

module.exports = mongoose.model('City', citySchema);