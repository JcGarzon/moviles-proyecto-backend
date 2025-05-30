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
    description: req.body.description,
    imageUrl: req.body.imageUrl // Add imageUrl
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
    const napoles = await City.findOne({ name: 'Nápoles' });
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
      { name: 'James Rodríguez', cityId: bogota._id, category: 'Deportista', description: 'Futbolista profesional', imageUrl: 'https://laotraverdad.co/wp-content/uploads/2024/07/20240710_224325-scaled.jpg' },
      { name: 'Shakira', cityId: barranquilla._id, category: 'Cantante', description: 'Artista internacional', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/2023-11-16_Gala_de_los_Latin_Grammy%2C_03_%28cropped%2901.jpg' },
      { name: 'Gabriel García Márquez', cityId: santa_marta._id, category: 'Escritor', description: 'Nobel de Literatura', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg' },
      { name: 'Sofía Vergara', cityId: barranquilla._id, category: 'Actriz', description: 'Actriz de Hollywood', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Sof%C3%ADa_Vergara_in_2020.jpg/640px-Sof%C3%ADa_Vergara_in_2020.jpg' },
      { name: 'Radamel Falcao', cityId: santa_marta._id, category: 'Deportista', description: 'Futbolista profesional', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCkQdqWOqiYONjRQIefn6Kn69ALU_bJGOO3w&s' },
      { name: 'Juanes', cityId: medellin._id, category: 'Cantante', description: 'Músico de rock latino', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/2023-11-16_Gala_de_los_Latin_Grammy%2C_14_%28cropped%29.jpg' },
      { name: 'Nairo Quintana', cityId: bogota._id, category: 'Deportista', description: 'Ciclista profesional', imageUrl: 'https://movistarteam.com/wp-content/uploads/2024/01/QUINTANA-Nairo-01.jpg' },
      { name: 'Fernando Botero', cityId: medellin._id, category: 'Artista', description: 'Pintor y escultor', imageUrl: 'https://cloudfront-us-east-1.images.arcpublishing.com/elespectador/LH4MQ2QZKRFE5DU6JJWWQYV6TM.jpg' },
      { name: 'Álvaro Uribe', cityId: medellin._id, category: 'Político', description: 'Ex presidente de Colombia', imageUrl: 'https://franciscofajardoabogados.com/wp-content/uploads/2024/10/Alvaro-Uribe-1280x1280.png' },
      { name: 'Catalina Sandino', cityId: bogota._id, category: 'Actriz', description: 'Actriz nominada al Óscar', imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTg5MDI5MTA0M15BMl5BanBnXkFtZTgwODE2NDA1NTE@._V1_.jpg' },
      // Italia: 10 personas famosas
      { name: 'Leonardo da Vinci', cityId: milan._id, category: 'Artista', description: 'Pintor del Renacimiento', imageUrl: 'https://static.nationalgeographic.es/files/styles/image_3200/public/01-leonardo-da-vinci-book-talk.jpg?w=1900&h=2279' },
      { name: 'Sophia Loren', cityId: roma._id, category: 'Actriz', description: 'Icono del cine italiano', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Sophia_Loren_-_1959.jpg/640px-Sophia_Loren_-_1959.jpg' },
      { name: 'Andrea Bocelli', cityId: milan._id, category: 'Cantante', description: 'Tenor de ópera', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Andrea_Bocelli_20190511_017-2_%28cropped%29.jpg/1200px-Andrea_Bocelli_20190511_017-2_%28cropped%29.jpg' },
      { name: 'Giorgio Armani', cityId: milan._id, category: 'Diseñador', description: 'Diseñador de moda', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/GiorgioArmani.jpg/1200px-GiorgioArmani.jpg' },
      { name: 'Geronimo Momo Benavides', cityId: napoles._id, category: 'Streamer', description: 'Streamer italiano', imageUrl: 'https://pbs.twimg.com/media/F9rLHpBWgAEuiz8.jpg' },
      { name: 'Luciano Pavarotti', cityId: modena._id, category: 'Cantante', description: 'Tenor de ópera', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Luciano_Pavarotti_2004.jpg/960px-Luciano_Pavarotti_2004.jpg' },
      { name: 'Monica Bellucci', cityId: roma._id, category: 'Actriz', description: 'Actriz de cine', imageUrl: 'https://www.infobae.com/resizer/v2/3QTRAM2AP3AYEUBUH675RIDY5A.jpg?auth=9204152370c57bbcb49b11be4c43d8a627cd34c4fab93d2889da620229e97ce3&smart=true&width=1200&height=1200&quality=85' },
      { name: 'Galileo Galilei', cityId: pisa._id, category: 'Científico', description: 'Astrónomo y matemático', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg/960px-Justus_Sustermans_-_Portrait_of_Galileo_Galilei%2C_1636.jpg' },
      { name: 'Valentino Rossi', cityId: urbino._id, category: 'Deportista', description: 'Piloto de motociclismo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Valentino_Rossi_2024_WEC_Fuji_1.jpg' },
      { name: 'Silvio Berlusconi', cityId: milan._id, category: 'Político', description: 'Ex primer ministro', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Silvio_Berlusconi_2018.jpg/1200px-Silvio_Berlusconi_2018.jpg' },
      // Alemania: 10 personas famosas
      { name: 'Albert Einstein', cityId: munich._id, category: 'Científico', description: 'Físico teórico', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/960px-Albert_Einstein_Head.jpg' },
      { name: 'Angela Merkel', cityId: berlin._id, category: 'Política', description: 'Ex canciller de Alemania', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Angela_Merkel_2019_cropped.jpg/1200px-Angela_Merkel_2019_cropped.jpg' },
      { name: 'Ludwig van Beethoven', cityId: bonn._id, category: 'Músico', description: 'Compositor clásico', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Beethoven.jpg/960px-Beethoven.jpg' },
      { name: 'Michael Schumacher', cityId: cologne._id, category: 'Deportista', description: 'Piloto de Fórmula 1', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Michael_Schumacher_%28Ferrari%29_-_GP_d%27Italia_1998.jpg' },
      { name: 'Johann Wolfgang von Goethe', cityId: frankfurt._id, category: 'Escritor', description: 'Poeta y dramaturgo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Goethe_%28Stieler_1828%29.jpg/960px-Goethe_%28Stieler_1828%29.jpg' },
      { name: 'Thomas Müller', cityId: munich._id, category: 'Deportista', description: 'Futbolista profesional', imageUrl: 'https://ca-times.brightspotcdn.com/dims4/default/b01f090/2147483647/strip/true/crop/6585x4390+0+0/resize/1200x800!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F66%2F07%2F5b8c8d2ec8e0a7bea9648785bea2%2F9a900f7e495440babb89980409179745' },
      { name: 'Heidi Klum', cityId: bergisch_gladbach._id, category: 'Modelo', description: 'Modelo y presentadora', imageUrl: 'https://www.nbc.com/sites/nbcblog/files/2024/09/heidi-klum-5.jpg' },
      { name: 'Karl Marx', cityId: trier._id, category: 'Filósofo', description: 'Economista y filósofo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Karl_Marx_001.jpg' },
      { name: 'Rammstein', cityId: berlin._id, category: 'Banda', description: 'Banda de metal industrial', imageUrl: 'https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/rammstein_1.png' },
      { name: 'Steffi Graf', cityId: mannheim._id, category: 'Deportista', description: 'Tenista profesional', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHWPCSYjd3suRwlfJLfi_kbfR1KPvlKwXAnA&s' }
    ];
    await FamousPerson.insertMany(famousPeople);
    res.json({ message: 'Datos iniciales de personas famosas agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;