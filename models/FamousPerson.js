const mongoose = require('mongoose');

const famousPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  category: { type: String, required: true }, // Ej: "Deportista", "Actor", "Político"
  description: { type: String, required: true },
  imageUrl: { type: String, required: false } // New field for image URL
});

module.exports = mongoose.model('FamousPerson', famousPersonSchema);