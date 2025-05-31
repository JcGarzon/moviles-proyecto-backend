const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');

// Obtener todas las visitas
router.get('/', auth, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('userId')
      .populate({
        path: 'siteId',
        populate: {
          path: 'cityId',
          populate: {
            path: 'countryId'
          }
        }
      });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener los 10 sitios más visitados por país
router.get('/top-sites-by-country', auth, async (req, res) => {
  try {
    const topSites = await Visit.aggregate([
      {
        $group: {
          _id: '$siteId',
          visitCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'sites',
          localField: '_id',
          foreignField: '_id',
          as: 'site'
        }
      },
      {
        $unwind: '$site'
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'site.cityId',
          foreignField: '_id',
          as: 'city'
        }
      },
      {
        $unwind: '$city'
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'city.countryId',
          foreignField: '_id',
          as: 'country'
        }
      },
      {
        $unwind: '$country'
      },
      {
        $group: {
          _id: '$country._id',
          countryName: { $first: '$country.name' },
          sites: {
            $push: {
              siteId: '$site._id',
              siteName: '$site.name',
              cityName: '$city.name',
              visitCount: '$visitCount',
              imageUrl: '$site.imageUrl' // Add imageUrl from site
            }
          }
        }
      },
      {
        $project: {
          countryName: 1,
          sites: {
            $slice: [
              { $sortArray: { input: '$sites', sortBy: { visitCount: -1 } } },
              10
            ]
          }
        }
      },
      {
        $sort: { countryName: 1 }
      }
    ]);

    res.json(topSites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Registrar una visita
router.post('/', auth, async (req, res) => {
  const visit = new Visit({
    userId: req.user.userId,
    siteId: req.body.siteId,
    visitDate: new Date()
  });

  try {
    const newVisit = await visit.save();
    res.status(201).json(newVisit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;