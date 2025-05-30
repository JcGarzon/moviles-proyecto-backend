const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const Site = require('../models/Site');
const auth = require('../middleware/auth');

// Obtener todos los platos
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().populate('siteId');
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un plato (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const dish = new Dish({
    name: req.body.name,
    siteId: req.body.siteId,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl // Add imageUrl
  });

  try {
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Insertar datos iniciales de platos
router.get('/seed', async (req, res) => {
  try {
    const museo_oro = await Site.findOne({ name: 'Museo del Oro' });
    const ciudad_amurallada = await Site.findOne({ name: 'Ciudad Amurallada' });
    const coliseo = await Site.findOne({ name: 'Coliseo' });
    const catedral_milan = await Site.findOne({ name: 'Catedral de Milán' });
    const muro_berlin = await Site.findOne({ name: 'Muro de Berlín' });
    const castillo_neuschwanstein = await Site.findOne({ name: 'Castillo de Neuschwanstein' });

    if (!museo_oro || !ciudad_amurallada || !coliseo || !catedral_milan || !muro_berlin || !castillo_neuschwanstein) {
      return res.status(400).json({ message: 'Sitios no encontrados, ejecuta /api/sites/seed primero' });
    }

    const dishes = [
      // Colombia: 10 platos tradicionales
      { name: 'Ajiaco', siteId: museo_oro._id, price: 15000, description: 'Sopa de papa y pollo', imageUrl: 'https://example.com/images/ajiaco.jpg' },
      { name: 'Bandeja Paisa', siteId: museo_oro._id, price: 20000, description: 'Plato típico de Antioquia', imageUrl: 'https://example.com/images/bandeja_paisa.jpg' },
      { name: 'Ceviche de Camarones', siteId: ciudad_amurallada._id, price: 18000, description: 'Ceviche caribeño', imageUrl: 'https://example.com/images/ceviche_camarones.jpg' },
      { name: 'Arepa de Huevo', siteId: ciudad_amurallada._id, price: 8000, description: 'Arepa con huevo frito', imageUrl: 'https://example.com/images/arepa_huevo.jpg' },
      { name: 'Sancocho', siteId: museo_oro._id, price: 16000, description: 'Sopa tradicional', imageUrl: 'https://example.com/images/sancocho.jpg' },
      { name: 'Tamal', siteId: museo_oro._id, price: 10000, description: 'Masa con carne envuelta', imageUrl: 'https://example.com/images/tamal.jpg' },
      { name: 'Lechona', siteId: museo_oro._id, price: 22000, description: 'Cerdo relleno', imageUrl: 'https://example.com/images/lechona.jpg' },
      { name: 'Pandebono', siteId: museo_oro._id, price: 3000, description: 'Pan de queso', imageUrl: 'https://example.com/images/pandebono.jpg' },
      { name: 'Arroz con Coco', siteId: ciudad_amurallada._id, price: 12000, description: 'Arroz dulce caribeño', imageUrl: 'https://example.com/images/arroz_coco.jpg' },
      { name: 'Empanadas', siteId: museo_oro._id, price: 5000, description: 'Empanadas de carne', imageUrl: 'https://example.com/images/empanadas.jpg' },
      // Italia: 10 platos tradicionales
      { name: 'Pizza Margherita', siteId: coliseo._id, price: 12000, description: 'Pizza clásica italiana', imageUrl: 'https://example.com/images/pizza_margherita.jpg' },
      { name: 'Pasta Carbonara', siteId: coliseo._id, price: 15000, description: 'Pasta con huevo y panceta', imageUrl: 'https://example.com/images/pasta_carbonara.jpg' },
      { name: 'Lasagna', siteId: catedral_milan._id, price: 18000, description: 'Pasta en capas con carne y queso', imageUrl: 'https://example.com/images/lasagna.jpg' },
      { name: 'Risotto', siteId: catedral_milan._id, price: 16000, description: 'Arroz cremoso con azafrán', imageUrl: 'https://example.com/images/risotto.jpg' },
      { name: 'Tiramisú', siteId: coliseo._id, price: 8000, description: 'Postre con café y mascarpone', imageUrl: 'https://example.com/images/tiramisu.jpg' },
      { name: 'Ossobuco', siteId: catedral_milan._id, price: 20000, description: 'Guiso de ternera', imageUrl: 'https://example.com/images/ossobuco.jpg' },
      { name: 'Gnocchi', siteId: coliseo._id, price: 14000, description: 'Dumplings de papa', imageUrl: 'https://example.com/images/gnocchi.jpg' },
      { name: 'Pesto alla Genovese', siteId: catedral_milan._id, price: 10000, description: 'Salsa de albahaca y ajo', imageUrl: 'https://example.com/images/pesto_genovese.jpg' },
      { name: 'Arancini', siteId: coliseo._id, price: 6000, description: 'Bolitas de arroz fritas', imageUrl: 'https://example.com/images/arancini.jpg' },
      { name: 'Gelato', siteId: coliseo._id, price: 5000, description: 'Helado italiano', imageUrl: 'https://example.com/images/gelato.jpg' },
      // Alemania: 10 platos tradicionales
      { name: 'Schnitzel', siteId: muro_berlin._id, price: 15000, description: 'Milanesa de cerdo', imageUrl: 'https://example.com/images/schnitzel.jpg' },
      { name: 'Sauerkraut', siteId: muro_berlin._id, price: 5000, description: 'Repollo fermentado', imageUrl: 'https://example.com/images/sauerkraut.jpg' },
      { name: 'Bratwurst', siteId: castillo_neuschwanstein._id, price: 8000, description: 'Salchicha alemana', imageUrl: 'https://example.com/images/bratwurst.jpg' },
      { name: 'Pretzel', siteId: castillo_neuschwanstein._id, price: 3000, description: 'Pan salado en forma de nudo', imageUrl: 'https://example.com/images/pretzel.jpg' },
      { name: 'Black Forest Cake', siteId: muro_berlin._id, price: 10000, description: 'Torta de cereza y chocolate', imageUrl: 'https://example.com/images/black_forest_cake.jpg' },
      { name: 'Rouladen', siteId: muro_berlin._id, price: 18000, description: 'Carne enrollada rellena', imageUrl: 'https://example.com/images/rouladen.jpg' },
      { name: 'Spätzle', siteId: castillo_neuschwanstein._id, price: 9000, description: 'Pasta de huevo', imageUrl: 'https://example.com/images/spatzle.jpg' },
      { name: 'Weisswurst', siteId: castillo_neuschwanstein._id, price: 7000, description: 'Salchicha blanca', imageUrl: 'https://example.com/images/weisswurst.jpg' },
      { name: 'Apfelstrudel', siteId: muro_berlin._id, price: 8000, description: 'Postre de manzana', imageUrl: 'https://example.com/images/apfelstrudel.jpg' },
      { name: 'Kartoffelsalat', siteId: muro_berlin._id, price: 6000, description: 'Ensalada de papa', imageUrl: 'https://example.com/images/kartoffelsalat.jpg' }
    ];
    await Dish.insertMany(dishes);
    res.json({ message: 'Datos iniciales de platos agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;