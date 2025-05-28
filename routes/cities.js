const express = require('express');
const router = express.Router();
const City = require('../models/City');
const Country = require('../models/Country');
const auth = require('../middleware/auth');

// Obtener todas las ciudades
router.get('/', async (req, res) => {
  try {
    const cities = await City.find().populate('countryId');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una ciudad (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const city = new City({
    name: req.body.name,
    countryId: req.body.countryId,
    population: req.body.population
  });

  try {
    const newCity = await city.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Insertar datos iniciales de ciudades
router.get('/seed', async (req, res) => {
  try {
    const colombia = await Country.findOne({ code: 'CO' });
    const italia = await Country.findOne({ code: 'IT' });
    const alemania = await Country.findOne({ code: 'DE' });

    if (!colombia || !italia || !alemania) {
      return res.status(400).json({ message: 'Países no encontrados, ejecuta /api/countries/seed primero' });
    }

    const cities = [
      // Colombia: 11 ciudades (incluyendo Ipiales)
      { name: 'Bogotá', countryId: colombia._id, population: 7743955 },
      { name: 'Medellín', countryId: colombia._id, population: 2496300 },
      { name: 'Cali', countryId: colombia._id, population: 2406531 },
      { name: 'Barranquilla', countryId: colombia._id, population: 1206000 },
      { name: 'Cartagena', countryId: colombia._id, population: 914552 },
      { name: 'Cúcuta', countryId: colombia._id, population: 777106 },
      { name: 'Bucaramanga', countryId: colombia._id, population: 570257 },
      { name: 'Pereira', countryId: colombia._id, population: 467269 },
      { name: 'Santa Marta', countryId: colombia._id, population: 455299 },
      { name: 'Ibagué', countryId: colombia._id, population: 421685 },
      { name: 'Ipiales', countryId: colombia._id, population: 150000 },
      // Italia: 14 ciudades (incluyendo las necesarias para famousPeople y sites)
      { name: 'Roma', countryId: italia._id, population: 2873000 },
      { name: 'Milán', countryId: italia._id, population: 1371000 },
      { name: 'Nápoles', countryId: italia._id, population: 962000 },
      { name: 'Turín', countryId: italia._id, population: 870000 },
      { name: 'Palermo', countryId: italia._id, population: 676000 },
      { name: 'Génova', countryId: italia._id, population: 558000 },
      { name: 'Bolonia', countryId: italia._id, population: 394000 },
      { name: 'Florencia', countryId: italia._id, population: 382000 },
      { name: 'Bari', countryId: italia._id, population: 320000 },
      { name: 'Catania', countryId: italia._id, population: 311000 },
      { name: 'Venecia', countryId: italia._id, population: 260000 },
      { name: 'Modena', countryId: italia._id, population: 185000 },
      { name: 'Pisa', countryId: italia._id, population: 90000 },
      { name: 'Urbino', countryId: italia._id, population: 15000 },
      // Alemania: 15 ciudades (incluyendo las necesarias para famousPeople y sites)
      { name: 'Berlín', countryId: alemania._id, population: 3669000 },
      { name: 'Hamburgo', countryId: alemania._id, population: 1849000 },
      { name: 'Múnich', countryId: alemania._id, population: 1553000 },
      { name: 'Colonia', countryId: alemania._id, population: 1086000 },
      { name: 'Fráncfort', countryId: alemania._id, population: 753000 },
      { name: 'Stuttgart', countryId: alemania._id, population: 635000 },
      { name: 'Düsseldorf', countryId: alemania._id, population: 621000 },
      { name: 'Dortmund', countryId: alemania._id, population: 588000 },
      { name: 'Essen', countryId: alemania._id, population: 583000 },
      { name: 'Leipzig', countryId: alemania._id, population: 582000 },
      { name: 'Bonn', countryId: alemania._id, population: 327000 },
      { name: 'Bergisch Gladbach', countryId: alemania._id, population: 111000 },
      { name: 'Trier', countryId: alemania._id, population: 110000 },
      { name: 'Mannheim', countryId: alemania._id, population: 309000 },
      { name: 'Freiburg', countryId: alemania._id, population: 230000 }
    ];
    await City.insertMany(cities);
    res.json({ message: 'Datos iniciales de ciudades agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;