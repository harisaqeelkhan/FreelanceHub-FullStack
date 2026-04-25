const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getSingleService,
  addService,
  saveService,
  hireService,
  getSaved,
  getHired
} = require('../controllers/servicesController');

router.get('/services', getAllServices);
router.get('/services/:id', getSingleService);
router.post('/services', addService);
router.post('/save', saveService);
router.post('/hire', hireService);
router.get('/saved', getSaved);
router.get('/hired', getHired);

module.exports = router;
