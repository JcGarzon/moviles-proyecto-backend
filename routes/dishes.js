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
    description: req.body.description
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
      { name: 'Ajiaco', siteId: museo_oro._id, price: 15000, description: 'Sopa de papa y pollo' },
      { name: 'Bandeja Paisa', siteId: museo_oro._id, price: 20000, description: 'Plato típico de Antioquia' },
      { name: 'Ceviche de Camarones', siteId: ciudad_amurallada._id, price: 18000, description: 'Ceviche caribeño' },
      { name: 'Arepa de Huevo', siteId: ciudad_amurallada._id, price: 8000, description: 'Arepa con huevo frito' },
      { name: 'Sancocho', siteId: museo_oro._id, price: 16000, description: 'Sopa tradicional' },
      { name: 'Tamal', siteId: museo_oro._id, price: 10000, description: 'Masa con carne envuelta' },
      { name: 'Lechona', siteId: museo_oro._id, price: 22000, description: 'Cerdo relleno' },
      { name: 'Pandebono', siteId: museo_oro._id, price: 3000, description: 'Pan de queso' },
      { name: 'Arroz con Coco', siteId: ciudad_amurallada._id, price: 12000, description: 'Arroz dulce caribeño' },
      { name: 'Empanadas', siteId: museo_oro._id, price: 5000, description: 'Empanadas de carne' },
      // Italia: 10 platos tradicionales
      { name: 'Pizza Margherita', siteId: coliseo._id, price: 12000, description: 'Pizza clásica italiana' },
      { name: 'Pasta Carbonara', siteId: coliseo._id, price: 15000, description: 'Pasta con huevo y panceta' },
      { name: 'Lasagna', siteId: catedral_milan._id, price: 18000, description: 'Pasta en capas con carne y queso' },
      { name: 'Risotto', siteId: catedral_milan._id, price: 16000, description: 'Arroz cremoso con azafrán' },
      { name: 'Tiramisú', siteId: coliseo._id, price: 8000, description: 'Postre con café y mascarpone' },
      { name: 'Ossobuco', siteId: catedral_milan._id, price: 20000, description: 'Guiso de ternera' },
      { name: 'Gnocchi', siteId: coliseo._id, price: 14000, description: 'Dumplings de papa' },
      { name: 'Pesto alla Genovese', siteId: catedral_milan._id, price: 10000, description: 'Salsa de albahaca y ajo' },
      { name: 'Arancini', siteId: coliseo._id, price: 6000, description: 'Bolitas de arroz fritas' },
      { name: 'Gelato', siteId: coliseo._id, price: 5000, description: 'Helado italiano' },
      // Alemania: 10 platos tradicionales
      { name: 'Schnitzel', siteId: muro_berlin._id, price: 15000, description: 'Milanesa de cerdo' },
      { name: 'Sauerkraut', siteId: muro_berlin._id, price: 5000, description: 'Repollo fermentado' },
      { name: 'Bratwurst', siteId: castillo_neuschwanstein._id, price: 8000, description: 'Salchicha alemana' },
      { name: 'Pretzel', siteId: castillo_neuschwanstein._id, price: 3000, description: 'Pan salado en forma de nudo' },
      { name: 'Black Forest Cake', siteId: muro_berlin._id, price: 10000, description: 'Torta de cereza y chocolate' },
      { name: 'Rouladen', siteId: muro_berlin._id, price: 18000, description: 'Carne enrollada rellena' },
      { name: 'Spätzle', siteId: castillo_neuschwanstein._id, price: 9000, description: 'Pasta de huevo' },
      { name: 'Weisswurst', siteId: castillo_neuschwanstein._id, price: 7000, description: 'Salchicha blanca' },
      { name: 'Apfelstrudel', siteId: muro_berlin._id, price: 8000, description: 'Postre de manzana' },
      { name: 'Kartoffelsalat', siteId: muro_berlin._id, price: 6000, description: 'Ensalada de papa' }
    ];
    await Dish.insertMany(dishes);
    res.json({ message: 'Datos iniciales de platos agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;