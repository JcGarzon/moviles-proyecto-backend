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

// Obtener un sitio por ID
router.get('/:id', async (req, res) => {
  try {
    const site = await Site.findById(req.params.id)
      .populate({
        path: 'cityId',
        populate: {
          path: 'countryId'
        }
      });

    if (!site) {
      return res.status(404).json({ message: 'Sitio no encontrado' });
    }

    res.json(site);
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
    description: req.body.description,
    imageUrl: req.body.imageUrl // Add imageUrl
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
      { name: 'Museo del Oro', cityId: bogota._id, type: 'Museo', description: 'Museo con artefactos precolombinos', imageUrl: 'https://museodata.com/images/museums/f9078c9e10d94490937f5c54f76d413a-1.jpg' },
      { name: 'Catedral de Sal de Zipaquirá', cityId: bogota._id, type: 'Iglesia', description: 'Catedral subterránea', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUjga2elUfPBw5AAGa7RAT6lc652JkAP-3vA&s' },
      { name: 'Ciudad Amurallada', cityId: cartagena._id, type: 'Sitio Histórico', description: 'Centro histórico de Cartagena', imageUrl: 'https://mlqfmr3rpryd.i.optimole.com/cb:JBSP.a525/w:auto/h:auto/q:100/ig:avif/https://cartagena-tours.co/wp-content/uploads/2023/12/Torre-del-Reloj-en-Cartagena-de-Indias-Colombia.jpg' },
      { name: 'Castillo de San Felipe', cityId: cartagena._id, type: 'Castillo', description: 'Fortaleza colonial', imageUrl: 'https://fortificacionescartagena.com.co/wp-content/uploads/2017/06/planee-su-visita-castillo-san-felipe.jpg' },
      { name: 'Parque Tayrona', cityId: santa_marta._id, type: 'Parque', description: 'Parque natural con playas', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTjR6bCvyPuYDRBL0dkPaOTrOxRQr8ZXQlog&s' },
      { name: 'Teatro Colón', cityId: bogota._id, type: 'Teatro', description: 'Teatro histórico', imageUrl: 'https://bogota.gov.co/sites/default/files/2019-03/archivo_instituto_distrital_de_turismo_12.jpg' },
      { name: 'Plaza de Bolívar', cityId: bogota._id, type: 'Plaza', description: 'Plaza principal de Bogotá', imageUrl: 'https://cdn.colombia.com/sdi/2013/11/27/plaza-de-bolivar-714091.jpg' },
      { name: 'Museo Botero', cityId: bogota._id, type: 'Museo', description: 'Museo de arte de Fernando Botero', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYfP6ylxoQWtdYaGvmcXHsltBmgCcGrRQNQQ&s' },
      { name: 'Parque Arqueológico de San Agustín', cityId: bogota._id, type: 'Sitio Arqueológico', description: 'Sitios arqueológicos', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScJENAcRn1lfnQ5spMu0WtkEp2L1S0NY9Kmw&s' },
      { name: 'Santuario de Las Lajas', cityId: ipiales._id, type: 'Iglesia', description: 'Iglesia en un cañón', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDt6ZZzdSHHYXQCSgaXowEyengmexCYfelYg&s' },
      // Italia: 10 sitios
      { name: 'Coliseo', cityId: roma._id, type: 'Sitio Histórico', description: 'Anfiteatro romano', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/960px-Colosseo_2020.jpg' },
      { name: 'Ciudad del Vaticano', cityId: roma._id, type: 'Sitio Religioso', description: 'Sede de la Iglesia Católica', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThKaQZl8yz6RotNUWcutaM9AqOZvvTDqNRGg&s' },
      { name: 'Catedral de Milán', cityId: milan._id, type: 'Iglesia', description: 'Catedral gótica', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVwysSl7o2-v2iStYdIPy2fNGSMDV8C7dhEw&s' },
      { name: 'Galería Uffizi', cityId: florencia._id, type: 'Museo', description: 'Museo de arte renacentista', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnpbP1AA-ta4k2HCKc6adBd1iC7Vq1SeH1qg&s' },
      { name: 'Torre de Pisa', cityId: pisa._id, type: 'Monumento', description: 'Torre inclinada', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjCUgY6NUQ8azmR0-YXVNnhhDO8agm3hPk3w&s' },
      { name: 'Canales de Venecia', cityId: venecia._id, type: 'Sitio Histórico', description: 'Canales icónicos', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShYmgdU-b4uiE7mpZetUs1TG9BQFKi-4usSA&s' },
      { name: 'Pompeya', cityId: napoles._id, type: 'Sitio Arqueológico', description: 'Ciudad romana preservada', imageUrl: 'https://cdn-imgix.headout.com/microbrands-content-image/image/1d806a7b3b0f3a2c22150a991a3352bf-Naples%20to%20Pompeii%20tour.jpeg' },
      { name: 'Piazza del Duomo', cityId: milan._id, type: 'Plaza', description: 'Plaza principal de Milán', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMI77rqdwX7_FTmNprf64B6mHAe3MZ9macEQ&s' },
      { name: 'Panteón', cityId: roma._id, type: 'Monumento', description: 'Templo romano', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Einblick_Panorama_Pantheon_Rom.jpg/960px-Einblick_Panorama_Pantheon_Rom.jpg' },
      { name: 'Costa Amalfitana', cityId: napoles._id, type: 'Zona Costera', description: 'Costa pintoresca', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP_mIGhCLMio6AXlGpRslY1q7LW2PhjCHCgA&s' },
      // Alemania: 10 sitios
      { name: 'Muro de Berlín', cityId: berlin._id, type: 'Sitio Histórico', description: 'Restos del muro divisorio', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Berlinermauer.jpg/330px-Berlinermauer.jpg' },
      { name: 'Castillo de Neuschwanstein', cityId: munich._id, type: 'Castillo', description: 'Castillo de cuento de hadas', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8df8orgDb1sOIKEdypxK4p3VvqjT3euYt3g&s' },
      { name: 'Catedral de Colonia', cityId: colonia._id, type: 'Iglesia', description: 'Catedral gótica', imageUrl: 'https://content-historia.nationalgeographic.com.es/medio/2020/12/15/noche_f0fe1be9_1280x853.jpg' },
      { name: 'Puerta de Brandeburgo', cityId: berlin._id, type: 'Monumento', description: 'Símbolo de la reunificación', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/1200px-Brandenburger_Tor_abends.jpg' },
      { name: 'Oktoberfest', cityId: munich._id, type: 'Evento', description: 'Festival de la cerveza', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDqM9YzgbxOeOAee8XVEFJyFbgqYZcYptunA&s' },
      { name: 'Museo Pergamon', cityId: berlin._id, type: 'Museo', description: 'Museo de antigüedades', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcV7_NEJ-Non1NUQf4K8mjsXGHXnd4pB8MRA&s' },
      { name: 'Selva Negra', cityId: freiburg._id, type: 'Zona Natural', description: 'Bosque pintoresco', imageUrl: 'https://www.revistaviajeros.es/sites/default/files/imagenes4937a.jpg' },
      { name: 'Reichstag', cityId: berlin._id, type: 'Edificio Gubernamental', description: 'Parlamento alemán', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Reichstagsgeb%C3%A4ude_von_Westen.jpg/1200px-Reichstagsgeb%C3%A4ude_von_Westen.jpg' },
      { name: 'Catedral de Múnich', cityId: munich._id, type: 'Iglesia', description: 'Catedral principal', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLXIntMFVegiwX2zroMdstAuPRVNPDoHJOhQ&s' },
      { name: 'Puente de los Mercaderes', cityId: leipzig._id, type: 'Puente', description: 'Puente histórico', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Narbonne_-_Le_pont_des_marchands.jpg/1200px-Narbonne_-_Le_pont_des_marchands.jpg' }
    ];
    await Site.insertMany(sites);
    res.json({ message: 'Datos iniciales de sitios agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;