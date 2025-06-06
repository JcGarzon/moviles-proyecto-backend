const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  type: { type: String, required: true }, // Ej: "Iglesia", "Estadio", "Museo"
  description: { type: String, required: true },
  imageUrl: { type: String, required: false } // New field for image URL
});

module.exports = mongoose.model('Site', siteSchema);