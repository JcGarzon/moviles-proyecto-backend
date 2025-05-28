const express = require('express');
const router = express.Router();
const Site = require('../models/Site');
const City = require('../models/City');
const auth = require('../middleware/auth');

// Obtener todos los sitios
router.get('/', async (req, res) => {
  try {
    const sites = await Site.find().populate('cityId');
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un sitio (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const site = new Site({
    name: req.body.name,
    cityId: req.body.cityId,
    type: req.body.type,
    description: req.body.description
  });

  try {
    const newSite = await site.save();
    res.status(201).json(newSite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Insertar datos iniciales de sitios
router.get('/seed', async (req, res) => {
  try {
    // Buscar todas las ciudades necesarias
    const bogota = await City.findOne({ name: 'Bogotá' });
    const cartagena = await City.findOne({ name: 'Cartagena' });
    const santa_marta = await City.findOne({ name: 'Santa Marta' });
    const roma = await City.findOne({ name: 'Roma' });
    const milan = await City.findOne({ name: 'Milán' });
    const berlin = await City.findOne({ name: 'Berlín' });
    const munich = await City.findOne({ name: 'Múnich' });
    const ipiales = await City.findOne({ name: 'Ipiales' });
    const florencia = await City.findOne({ name: 'Florencia' });
    const pisa = await City.findOne({ name: 'Pisa' });
    const venecia = await City.findOne({ name: 'Venecia' });
    const napoles = await City.findOne({ name: 'Nápoles' });
    const colonia = await City.findOne({ name: 'Colonia' });
    const freiburg = await City.findOne({ name: 'Freiburg' });
    const leipzig = await City.findOne({ name: 'Leipzig' });

    // Verificar que todas las ciudades existan
    if (!bogota || !cartagena || !santa_marta || !roma || !milan || !berlin || !munich || !ipiales ||
        !florencia || !pisa || !venecia || !napoles || !colonia || !freiburg || !leipzig) {
      return res.status(400).json({ message: 'Alguna ciudad no encontrada, ejecuta /api/cities/seed primero y verifica los datos' });
    }

    const sites = [
      // Colombia: 10 sitios
      { name: 'Museo del Oro', cityId: bogota._id, type: 'Museo', description: 'Museo con artefactos precolombinos' },
      { name: 'Catedral de Sal de Zipaquirá', cityId: bogota._id, type: 'Iglesia', description: 'Catedral subterránea' },
      { name: 'Ciudad Amurallada', cityId: cartagena._id, type: 'Sitio Histórico', description: 'Centro histórico de Cartagena' },
      { name: 'Castillo de San Felipe', cityId: cartagena._id, type: 'Castillo', description: 'Fortaleza colonial' },
      { name: 'Parque Tayrona', cityId: santa_marta._id, type: 'Parque', description: 'Parque natural con playas' },
      { name: 'Teatro Colón', cityId: bogota._id, type: 'Teatro', description: 'Teatro histórico' },
      { name: 'Plaza de Bolívar', cityId: bogota._id, type: 'Plaza', description: 'Plaza principal de Bogotá' },
      { name: 'Museo Botero', cityId: bogota._id, type: 'Museo', description: 'Museo de arte de Fernando Botero' },
      { name: 'Parque Arqueológico de San Agustín', cityId: bogota._id, type: 'Sitio Arqueológico', description: 'Sitios arqueológicos' },
      { name: 'Santuario de Las Lajas', cityId: ipiales._id, type: 'Iglesia', description: 'Iglesia en un cañón' },
      // Italia: 10 sitios
      { name: 'Coliseo', cityId: roma._id, type: 'Sitio Histórico', description: 'Anfiteatro romano' },
      { name: 'Ciudad del Vaticano', cityId: roma._id, type: 'Sitio Religioso', description: 'Sede de la Iglesia Católica' },
      { name: 'Catedral de Milán', cityId: milan._id, type: 'Iglesia', description: 'Catedral gótica' },
      { name: 'Galería Uffizi', cityId: florencia._id, type: 'Museo', description: 'Museo de arte renacentista' },
      { name: 'Torre de Pisa', cityId: pisa._id, type: 'Monumento', description: 'Torre inclinada' },
      { name: 'Canales de Venecia', cityId: venecia._id, type: 'Sitio Histórico', description: 'Canales icónicos' },
      { name: 'Pompeya', cityId: napoles._id, type: 'Sitio Arqueológico', description: 'Ciudad romana preservada' },
      { name: 'Piazza del Duomo', cityId: milan._id, type: 'Plaza', description: 'Plaza principal de Milán' },
      { name: 'Panteón', cityId: roma._id, type: 'Monumento', description: 'Templo romano' },
      { name: 'Costa Amalfitana', cityId: napoles._id, type: 'Zona Costera', description: 'Costa pintoresca' },
      // Alemania: 10 sitios
      { name: 'Muro de Berlín', cityId: berlin._id, type: 'Sitio Histórico', description: 'Restos del muro divisorio' },
      { name: 'Castillo de Neuschwanstein', cityId: munich._id, type: 'Castillo', description: 'Castillo de cuento de hadas' },
      { name: 'Catedral de Colonia', cityId: colonia._id, type: 'Iglesia', description: 'Catedral gótica' },
      { name: 'Puerta de Brandeburgo', cityId: berlin._id, type: 'Monumento', description: 'Símbolo de la reunificación' },
      { name: 'Oktoberfest', cityId: munich._id, type: 'Evento', description: 'Festival de la cerveza' },
      { name: 'Museo Pergamon', cityId: berlin._id, type: 'Museo', description: 'Museo de antigüedades' },
      { name: 'Selva Negra', cityId: freiburg._id, type: 'Zona Natural', description: 'Bosque pintoresco' },
      { name: 'Reichstag', cityId: berlin._id, type: 'Edificio Gubernamental', description: 'Parlamento alemán' },
      { name: 'Catedral de Múnich', cityId: munich._id, type: 'Iglesia', description: 'Catedral principal' },
      { name: 'Puente de los Mercaderes', cityId: leipzig._id, type: 'Puente', description: 'Puente histórico' }
    ];
    await Site.insertMany(sites);
    res.json({ message: 'Datos iniciales de sitios agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;