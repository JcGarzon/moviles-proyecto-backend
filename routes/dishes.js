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
      { name: 'Ajiaco', siteId: museo_oro._id, price: 15000, description: 'Sopa de papa y pollo', imageUrl: 'https://www.expogourmetmagazine.com/uploads/fotos_noticias/2023/07/w1200px_27894-218994-recetas-del-mundo-colombia-ajiaco.jpg' },
      { name: 'Bandeja Paisa', siteId: museo_oro._id, price: 20000, description: 'Plato típico de Antioquia', imageUrl: 'https://d1uz88p17r663j.cloudfront.net/original/1570939e9f814bec82c668279513c94f_BANDEJA-PAISA.jpg' },
      { name: 'Ceviche de Camarones', siteId: ciudad_amurallada._id, price: 18000, description: 'Ceviche caribeño', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBha9OfW47nD1KpHm7z2e9DXgISgiiN1j2uw&s' },
      { name: 'Arepa de Huevo', siteId: ciudad_amurallada._id, price: 8000, description: 'Arepa con huevo frito', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQBTXQh4aqOtzcxIQJH9AP0IGOQvj6n98qw&s' },
      { name: 'Sancocho', siteId: museo_oro._id, price: 16000, description: 'Sopa tradicional', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThV8kDYLleLuVT4SmSkIvSxcSPPxvK9Bva-A&s' },
      { name: 'Tamal', siteId: museo_oro._id, price: 10000, description: 'Masa con carne envuelta', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKgsgCcFONu7x2tj5SRg0o9cv1CCQY1xZlTA&s' },
      { name: 'Lechona', siteId: museo_oro._id, price: 22000, description: 'Cerdo relleno', imageUrl: 'https://cdn.colombia.com/gastronomia/2011/07/22/lechona-1476.jpg' },
      { name: 'Pandebono', siteId: museo_oro._id, price: 3000, description: 'Pan de queso', imageUrl: 'https://hazdeoros.com/familiar/wp-content/uploads/2024/09/almojabanas-baked-on-a-baking-sheet-2023-11-27-04-49-27-utc-2.jpg' },
      { name: 'Arroz con Coco', siteId: ciudad_amurallada._id, price: 12000, description: 'Arroz dulce caribeño', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsmKJe3S7gWLxU2U5Xq9IkVOA4JlTgmnG2LQ&s' },
      { name: 'Empanadas', siteId: museo_oro._id, price: 5000, description: 'Empanadas de carne', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6MTS9nwQeRBI7fvNeWbVMsFAigBXI9kHBAw&s' },
      // Italia: 10 platos tradicionales
      { name: 'Pizza Margherita', siteId: coliseo._id, price: 12000, description: 'Pizza clásica italiana', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY7RbPLpeQGEKr-JMLB6L9kRdCTMtUbFJfJw&s },
      { name: 'Pasta Carbonara', siteId: coliseo._id, price: 15000, description: 'Pasta con huevo y panceta', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDNgnddUmlzqZgpQc5PHUYCUc0BMRS7S2eXg&s },
      { name: 'Lasagna', siteId: catedral_milan._id, price: 18000, description: 'Pasta en capas con carne y queso', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ73xyJnJvRAGkOybHGbacQQa8a-uAArfOgMQ&s' },
      { name: 'Risotto', siteId: catedral_milan._id, price: 16000, description: 'Arroz cremoso con azafrán', imageUrl: 'https://images.cookforyourlife.org/wp-content/uploads/2018/08/shutterstock_53574826.jpg' },
      { name: 'Tiramisú', siteId: coliseo._id, price: 8000, description: 'Postre con café y mascarpone', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKs2DA-_PIKEEOtohBOBKRF7QLHqN7um7ckQ&s' },
      { name: 'Ossobuco', siteId: catedral_milan._id, price: 20000, description: 'Guiso de ternera', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSalSbGjuEPlXrUeIYZlFYuf6rLy-ikAt3bvw&s' },
      { name: 'Gnocchi', siteId: coliseo._id, price: 14000, description: 'Dumplings de papa', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmcZzeqYkMrGiz1eaxjKG_KeJQof_E968SQ&s' },
      { name: 'Pesto alla Genovese', siteId: catedral_milan._id, price: 10000, description: 'Salsa de albahaca y ajo', imageUrl: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/A84C97BB-F426-49D2-89C0-CE4D51DA114C/Derivates/A5E989EE-8E12-41B1-BB46-7E0C8C7495DF.jpg' },
      { name: 'Arancini', siteId: coliseo._id, price: 6000, description: 'Bolitas de arroz fritas', imageUrl: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/0635BB65-320C-47B7-B52A-555E986646D9/Derivates/28fad4c4-c3b1-4018-b4b5-743b3ce4ad99.jpg' },
      { name: 'Gelato', siteId: coliseo._id, price: 5000, description: 'Helado italiano', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmBwiv4nk21wE4aCYrsiFiVYHCBeoMful5UQ&s },
      // Alemania: 10 platos tradicionales
      { name: 'Schnitzel', siteId: muro_berlin._id, price: 15000, description: 'Milanesa de cerdo', imageUrl: 'https://thestayathomechef.com/wp-content/uploads/2024/04/Authentic-German-Schnitzel_Square-2.jpg' },
      { name: 'Sauerkraut', siteId: muro_berlin._id, price: 5000, description: 'Repollo fermentado', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoYRsHzgfgBp0o--EyMqy8umG8yp-XIEeq3Q&s' },
      { name: 'Bratwurst', siteId: castillo_neuschwanstein._id, price: 8000, description: 'Salchicha alemana', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ygxB410F7wvG4ebGklQu-kmxpnr4fcvWXg&s' },
      { name: 'Pretzel', siteId: castillo_neuschwanstein._id, price: 3000, description: 'Pan salado en forma de nudo', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZVq_69RsJp75vZKTJl7gesX9aMjpCJOYO7w&s' },
      { name: 'Black Forest Cake', siteId: muro_berlin._id, price: 10000, description: 'Torta de cereza y chocolate', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZISbGuYC2cO20Td-e3WgAULQ6goTnRX1OoA&s' },
      { name: 'Rouladen', siteId: muro_berlin._id, price: 18000, description: 'Carne enrollada rellena', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE6ok3-F6AogvfymWFNK4ivMvlSo1dC3Cd2A&s' },
      { name: 'Spätzle', siteId: castillo_neuschwanstein._id, price: 9000, description: 'Pasta de huevo', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg4XI-DMPARc9hRIbzM2pogbHgAYJRFE_uUQ&s' },
      { name: 'Weisswurst', siteId: castillo_neuschwanstein._id, price: 7000, description: 'Salchicha blanca', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Wei%C3%9Fwurst-1.jpg/1200px-Wei%C3%9Fwurst-1.jpg' },
      { name: 'Apfelstrudel', siteId: muro_berlin._id, price: 8000, description: 'Postre de manzana', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Wiener_Apfelstrudel.jpg' },
      { name: 'Kartoffelsalat', siteId: muro_berlin._id, price: 6000, description: 'Ensalada de papa', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNj0pNPP7WYYwBOfACLBfEHw34dfPFG1jlAA&s' }
    ];
    await Dish.insertMany(dishes);
    res.json({ message: 'Datos iniciales de platos agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;