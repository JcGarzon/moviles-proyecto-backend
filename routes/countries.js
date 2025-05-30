const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const auth = require('../middleware/auth');

// Obtener todos los países
router.get('/', async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un país (solo admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'No autorizado' });

  const country = new Country({
    name: req.body.name,
    code: req.body.code,
    imageUrl: req.body.imageUrl // Add imageUrl
  });

  try {
    const newCountry = await country.save();
    res.status(201).json(newCountry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Insertar datos iniciales de países
router.get('/seed', async (req, res) => {
  try {
    const countries = [
      { name: 'Colombia', code: 'CO', imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAHlBMVEX/zQAAMIfIEC7/0gCdiFgAJooAMYuwGEPKDyzEFDFzI/UMAAAA00lEQVR4nO3QsQGCABAAsUdQcP+F7f9ay2SEzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPzJyTYX27zZ5mBzUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTmo+bHOzzcM2LzYn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpObL9gO+4beyY1oovAAAAABJRU5ErkJggg==' },
      { name: 'Italia', code: 'IT', imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnCAMAAAAPIrEmAAAAHlBMVEUAkkbOKzf///+r28LvuLxUtoPLaWvH59ag1rrIvbO2lRRDAAAAzUlEQVR4nO3PyRWAIBAFsGERpf+G6YH3vSUdpCpv9LjZ8n6Yq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq6urq1/Vn7zvjdsr7wCzuKqVC083sAAAAABJRU5ErkJggg==' },
      { name: 'Alemania', code: 'DE', imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAACuCAMAAAClZfCTAAAAElBMVEUAAAD/zgDdAADnAADaAAD/2AAtsSEoAAAA+ElEQVR4nO3QMQGAMAAEsYeCf8tIuI0pkZANAAAAAAAAAAAAAAAAAAAAgB8dwm6CoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKewh7CbsIipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUofMGTNC8HkSxoAAAAASUVORK5CYII=' }
    ];
    await Country.insertMany(countries);
    res.json({ message: 'Datos iniciales de países agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;