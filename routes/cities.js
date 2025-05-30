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
    population: req.body.population,
    imageUrl: req.body.imageUrl // Add imageUrl
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
      { name: 'Bogotá', countryId: colombia._id, population: 7743955, imageUrl: 'https://2182029.fs1.hubspotusercontent-na1.net/hubfs/2182029/Centro%20de%20la%20ciudad%20-%20El%20centro%20de%20Bogot%C3%A1-Bogot%C3%A1%20de%20noche.jpg' },
      { name: 'Medellín', countryId: colombia._id, population: 2496300, imageUrl: 'https://d219336yigegi3.cloudfront.net/sites/noticias-m2/files/field/image/El-Poblado-Medellin-1080x810.jpg' },
      { name: 'Cali', countryId: colombia._id, population: 2406531, imageUrl: 'https://blog.uber-cdn.com/cdn-cgi/image/width=2160,quality=80,onerror=redirect,format=auto/wp-content/uploads/2018/06/CO_X-lugares-turi%CC%81sticos-de-Cali-que-te-dejara%CC%81n-sin-palabras.jpg' },
      { name: 'Barranquilla', countryId: colombia._id, population: 1206000, imageUrl: 'https://barranquilla.gov.co/wp-content/uploads/2019/09/barranquilla_01945-e1569863568539.jpg' },
      { name: 'Cartagena', countryId: colombia._id, population: 914552, imageUrl: 'https://cdn-ilcfjhh.nitrocdn.com/AMsOVcaxJEBiDUJmLghgteLoXmGyZJhB/assets/images/optimized/rev-7a867c4/cartagena-tours.co/wp-content/uploads/2023/04/cartagena-vacations.jpg' },
      { name: 'Cúcuta', countryId: colombia._id, population: 777106, imageUrl: 'https://turismo.encolombia.com/wp-content/uploads/2012/12/San-Jose-de-Cucuta.jpg' },
      { name: 'Bucaramanga', countryId: colombia._id, population: 570257, imageUrl: 'https://grupodomus.com.co/wp-content/uploads/2023/01/Razones-para-vivir-en-la-ciudad-bonita_Bucaramanga-1900x1069.jpg.webp' },
      { name: 'Pereira', countryId: colombia._id, population: 467269, imageUrl: 'https://arriendo.com/co/blog/wp-content/uploads/2021/11/vivir-en-pereira-1400x933.jpg' },
      { name: 'Santa Marta', countryId: colombia._id, population: 455299, imageUrl: 'https://hotelsantorini.com.co/wp-content/uploads/2025/01/23-ENE-PORTADA.jpg' },
      { name: 'Ibagué', countryId: colombia._id, population: 421685, imageUrl: 'https://ondasdeibague.com/images/TatianaAlvira2021/Marzo/Ibagu%C3%A9_23_12.jpeg' },
      { name: 'Ipiales', countryId: colombia._id, population: 150000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Ipiales_-_Panorama.jpg' },
      // Italia: 14 ciudades
      { name: 'Roma', countryId: italia._id, population: 2873000, imageUrl: 'https://inlifehousing.com/wp-content/uploads/2023/06/Roma.jpg' },
      { name: 'Milán', countryId: italia._id, population: 1371000, imageUrl: 'https://tourismmedia.italia.it/is/image/mitur/20220311104119-shutterstock-1924100396-5?wid=1080&hei=660&fit=constrain,1&fmt=webp' },
      { name: 'Nápoles', countryId: italia._id, population: 962000, imageUrl: 'https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2021/09/29/16329160099600.jpg' },
      { name: 'Turín', countryId: italia._id, population: 870000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyfNIyWafUJ7Xcg2lhYnduZgBVkRhbuCkuqQ&s' },
      { name: 'Palermo', countryId: italia._id, population: 676000, imageUrl: 'https://mediaim.expedia.com/destination/1/8597d2ba6da5e136849bae14c37079cb.jpg' },
      { name: 'Génova', countryId: italia._id, population: 558000, imageUrl: 'https://www.italia.it/content/dam/tdh/es/interests/liguria/genova/genova/media/20210506124258-shutterstock-1410992927.jpg' },
      { name: 'Bolonia', countryId: italia._id, population: 394000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Bologna-SanPetronioPiazzaMaggiore1.jpg' },
      { name: 'Florencia', countryId: italia._id, population: 382000, imageUrl: 'https://tourismmedia.italia.it/is/image/mitur/20210401173629-firenze-toscana-gettyimages-1145040590-1?wid=1600&hei=900&fit=constrain,1&fmt=webp' },
      { name: 'Bari', countryId: italia._id, population: 320000, imageUrl: 'https://storage.googleapis.com/mytour-prod/blog/cosa-fare-a-bari-la-guida-essenziale_2020-09-shutterstock_1681998358.jpg' },
      { name: 'Catania', countryId: italia._id, population: 311000, imageUrl: 'https://lagavetavoladora.com/wp-content/uploads/2019/10/Que-ver-en-Catania.jpg' },
      { name: 'Venecia', countryId: italia._id, population: 260000, imageUrl: 'https://pohcdn.com/sites/default/files/styles/node__blog_post__bp_banner/public/2021-02/Rialto-Bridge.jpg' },
      { name: 'Modena', countryId: italia._id, population: 185000, imageUrl: 'https://tourismmedia.italia.it/is/image/mitur/20210310112348-shutterstock-1765880312-2?wid=1600&hei=900&fit=constrain,1&fmt=webp' },
      { name: 'Pisa', countryId: italia._id, population: 90000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Italy_-_Pisa.jpg' },
      { name: 'Urbino', countryId: italia._id, population: 15000, imageUrl: 'https://www.anitavillas.com/blog/wp-content/uploads//altro-da-vedere-a-urbino.jpg' },
      // Alemania: 15 ciudades
      { name: 'Berlín', countryId: alemania._id, population: 3669000, imageUrl: 'https://ligula.se/wp-content/uploads/2023/07/Destinations-Berlin.png' },
      { name: 'Hamburgo', countryId: alemania._id, population: 1849000, imageUrl: 'https://www.fundacionaquae.org/wp-content/uploads/2016/03/hamburgo.jpg' },
      { name: 'Múnich', countryId: alemania._id, population: 1553000, imageUrl: 'https://images.ctfassets.net/q33z48p65a6w/54CwImYeI5NmSXBaJReAiW/f2f95e8f1a400c0484528a907b9a5ddc/ian-kelsall-MEUvVqkU3QI-unsplash.jpg' },
      { name: 'Colonia', countryId: alemania._id, population: 1086000, imageUrl: 'https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2023/01/12/istock-658000044.jpeg' },
      { name: 'Fráncfort', countryId: alemania._id, population: 753000, imageUrl: 'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/501000/501416-hessen-germany.jpg' },
      { name: 'Stuttgart', countryId: alemania._id, population: 635000, imageUrl: 'https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2024/09/17/skyline-de-stuttgart-en-un-hermoso-dia-istock-1474576550.jpeg' },
      { name: 'Düsseldorf', countryId: alemania._id, population: 621000, imageUrl: 'https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2023/02/16/istock-1427716886.jpeg' },
      { name: 'Dortmund', countryId: alemania._id, population: 588000, imageUrl: 'https://pohcdn.com/sites/default/files/styles/paragraph__live_banner__lb_image__1880bp/public/live_banner/Dortmund.jpg' },
      { name: 'Essen', countryId: alemania._id, population: 583000, imageUrl: 'https://media.essen.de/media/emg_1/essen_tourismus/bilder_neu_1/weihnachtsmarkt_2/2024_6/2023_IWM_Essen_Panorama_Ost_k_Christian_Deutscher-EMG_1024_16zu9.jpg' },
      { name: 'Leipzig', countryId: alemania._id, population: 582000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKDXk3btoJq6AS-s1CJibtNcUNsHBNA9gjxw&s' },
      { name: 'Bonn', countryId: alemania._id, population: 327000, imageUrl: 'https://www.germany.travel/media/redaktion/staedte_kultur_content/bonn/Bonn_Stadtansicht_mit_Rhein_und_Blick_auf_das_Siebengebirge_Luftbild.jpg' },
      { name: 'Bergisch Gladbach', countryId: alemania._id, population: 111000, imageUrl: 'https://content.r9cdn.net/rimg/dimg/e3/06/0c4c7784-city-41338-17172e9fff6.jpg?width=1366&height=768&xhint=909&yhint=516&crop=true' },
      { name: 'Trier', countryId: alemania._id, population: 110000, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Trier-Blick-vom_Weishaus.JPG' },
      { name: 'Mannheim', countryId: alemania._id, population: 309000, imageUrl: 'https://d1bvpoagx8hqbg.cloudfront.net/originals/experiencia-mannheim-alemania-por-julia-ebefb00ad186804e5a85f4b350e41310.jpg' },
      { name: 'Freiburg', countryId: alemania._id, population: 230000, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZaw9mDaSgnKGe-5Pm6n5LUVoHwGt6rSViiw&s' }
    ];
    await City.insertMany(cities);
    res.json({ message: 'Datos iniciales de ciudades agregados' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;