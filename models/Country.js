const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  imageUrl: { type: String, required: false } // New field for image URL
});

module.exports = mongoose.model('Country', countrySchema);