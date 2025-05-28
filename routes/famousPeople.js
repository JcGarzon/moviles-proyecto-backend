const express = require('express');
const router = express.Router();
const FamousPerson = require('../models/FamousPerson');
const City = require('../models/City');
const auth = require('../middleware/auth');

// Obtener todas las personas famosas
router.get('/', async (req, res) => {
  try {
    const famousPeople = await FamousPerson.find().populate('cityId');
    res.json(famousPeople);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una persona famosa (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const famousPerson = new FamousPerson({
    name: req.body.name,
    cityId: req.body.cityId,
    category: req.body.category,
    description: req.body.description
  });

  try {
    const newFamousPerson = await famousPerson.save();
    res.status(201).json(newFamousPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Insertar datos iniciales de personas famosas
router.get('/seed', async (req, res) => {
  try {
    const bogota = await City.findOne({ name: 'Bogotá' });
    const medellin = await City.findOne({ name: 'Medellín' });
    const barranquilla = await City.findOne({ name: 'Barranquilla' });
    const santa_marta = await City.findOne({ name: 'Santa Marta' });
    const roma = await City.findOne({ name: 'Roma' });
    const milan = await City.findOne({ name: 'Milán' });
    const venecia = await City.findOne({ name: 'Venecia' });
    const modena = await City.findOne({ name: 'Modena' });
    const pisa = await City.findOne({ name: 'Pisa' });
    const urbino = await City.findOne({ name: 'Urbino' });
    const berlin = await City.findOne({ name: 'Berlín' });
    const munich = await City.findOne({ name: 'Múnich' });
    const bonn = await City.findOne({ name: 'Bonn' });
    const cologne = await City.findOne({ name: 'Colonia' });
    const frankfurt = await City.findOne({ name: 'Fráncfort' });
    const bergisch_gladbach = await City.findOne({ name: 'Bergisch Gladbach' });
    const trier = await City.findOne({ name: 'Trier' });
    const mannheim = await City.findOne({ name: 'Mannheim' });

    if (!bogota || !medellin || !barranquilla || !santa_marta || !roma || !milan || !venecia || !modena || !pisa || !urbino ||
        !berlin || !munich || !bonn || !cologne || !frankfurt || !bergisch_gladbach || !trier || !mannheim) {
      return res.status(400).json({ message: 'Alguna ciudad no encontrada, ejecuta /api/cities/seed primero y verifica los datos' });
    }

    const famousPeople = [
      // Colombia: 10 personas famosas
      { name: 'James Rodríguez', cityId: bogota._id, category: 'Deportista', description: 'Futbolista profesional' },
      { name: 'Shakira', cityId: barranquilla._id, category: 'Cantante', description: 'Artista internacional' },
      { name: 'Gabriel García Márquez', cityId: santa_marta._id, category: 'Escritor', description: 'Nobel de Literatura' },
      { name: 'Sofía Vergara', cityId: barranquilla._id, category: 'Actriz', description: 'Actriz de Hollywood' },
      { name: 'Radamel Falcao', cityId: santa_marta._id, category: 'Deportista', description: 'Futbolista profesional' },
      { name: 'Juanes', cityId: medellin._id, category: 'Cantante', description: 'Músico de rock latino' },
      { name: 'Nairo Quintana', cityId: bogota._id, category: 'Deportista', description: 'Ciclista profesional' },
      { name: 'Fernando Botero', cityId: medellin._id, category: 'Artista', description: 'Pintor y escultor' },
      { name: 'Álvaro Uribe', cityId: medellin._id, category: 'Político', description: 'Ex presidente de Colombia' },
      { name: 'Catalina Sandino', cityId: bogota._id, category: 'Actriz', description: 'Actriz nominada al Óscar' },
      // Italia: 10 personas famosas
      { name: 'Leonardo da Vinci', cityId: milan._id, category: 'Artista', description: 'Pintor del Renacimiento' },
      { name: 'Sophia Loren', cityId: roma._id, category: 'Actriz', description: 'Icono del cine italiano' },
      { name: 'Andrea Bocelli', cityId: milan._id, category: 'Cantante', description: 'Tenor de ópera' },
      { name: 'Giorgio Armani', cityId: milan._id, category: 'Diseñador', description: 'Diseñador de moda' },
      { name: 'Marco Polo', cityId: venecia._id, category: 'Explorador', description: 'Explorador famoso' },
      { name: 'Luciano Pavarotti', cityId: modena._id, category: 'Cantante', description: 'Tenor de ópera' },
      { name: 'Monica Bellucci', cityId: roma._id, category: 'Actriz', description: 'Actriz de cine' },
      { name: 'Galileo Galilei', cityId: pisa._id, category: 'Científico', description: 'Astrónomo y matemático' },
      { name: 'Valentino Rossi', cityId: urbino._id, category: 'Deportista', description: 'Piloto de motociclismo' },
      { name: 'Silvio Berlusconi', cityId: milan._id, category: 'Político', description: 'Ex primer ministro' },
      // Alemania: 10 personas famosas
      { name: 'Albert Einstein', cityId: munich._id, category: 'Científico', description: 'Físico teórico' },
      { name: 'Angela Merkel', cityId: berlin._id, category: 'Política', description: 'Ex canciller de Alemania' },
      { name: 'Ludwig van Beethoven', cityId: bonn._id, category: 'Músico', description: 'Compositor clásico' },
      { name: 'Michael Schumacher', cityId: cologne._id, category: 'Deportista', description: 'Piloto de Fórmula 1' },
      { name: 'Johann Wolfgang von Goethe', cityId: frankfurt._id, category: 'Escritor', description: 'Poeta y dramaturgo' },
      { name: 'Thomas Müller', cityId: munich._id, category: 'Deportista', description: 'Futbolista profesional' },
      { name: 'Heidi Klum', cityId: bergisch_gladbach._id, category: 'Modelo', description: 'Modelo y presentadora' },
      { name: 'Karl Marx', cityId: trier._id, category: 'Filósofo', description: 'Economista y filósofo' },
      { name: 'Rammstein', cityId: berlin._id, category: 'Banda', description: 'Banda de metal industrial' },
      { name: 'Steffi Graf', cityId: mannheim._id, category: 'Deportista', description: 'Tenista profesional' }
    ];
    await FamousPerson.insertMany(famousPeople);
    res.json({ message: 'Datos iniciales de personas famosas agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;