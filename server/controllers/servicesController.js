const fs = require('fs');
const path = require('path');

// data file se load ho raha hai
const dataPath = path.join(__dirname, '../data/services.json');
let services = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// in-memory lists - server restart pe reset ho jaenge
let savedServices = [];
let hiredServices = [];

const getAllServices = (req, res) => {
  try {
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSingleService = (req, res) => {
  // id string hoti hai isliye parseInt zaruri hai
  const id = parseInt(req.params.id);
  const service = services.find(s => s.id === id);

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  res.status(200).json(service);
};

// bonus endpoint
const addService = (req, res) => {
  const { title, category, price, seller, description, deliveryDays } = req.body;

  if (!title || !price || !seller) {
    return res.status(400).json({ message: 'Title, price and seller are required' });
  }

  const newService = {
    id: services.length + 1,  // bug: agar koi delete ho jaye to id repeat ho sakti hai
    title,
    category: category || 'Other',
    price: parseFloat(price),
    rating: 0,
    seller,
    description: description || '',
    deliveryDays: deliveryDays || 3,
    reviews: 0
  };

  services.push(newService);
  res.status(201).json(newService);
};

const saveService = (req, res) => {
  const { serviceId } = req.body;

  if (!serviceId) {
    return res.status(400).json({ message: 'serviceId is required' });
  }

  const service = services.find(s => s.id === parseInt(serviceId));
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  // duplicate check nahi lagaya - intentionally
  savedServices.push(service);
  res.status(200).json({ message: 'Service saved!', saved: savedServices.length });
};

const hireService = (req, res) => {
  const { serviceId } = req.body;

  if (!serviceId) {
    return res.status(400).json({ message: 'serviceId is required' });
  }

  const service = services.find(s => s.id === parseInt(serviceId));
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  hiredServices.push({ ...service, hiredAt: new Date().toISOString() });
  res.status(200).json({ message: 'Service hired!', total: hiredServices.length });
};

const getSaved = (req, res) => {
  res.status(200).json(savedServices);
};

const getHired = (req, res) => {
  res.status(200).json(hiredServices);
};

module.exports = {
  getAllServices,
  getSingleService,
  addService,
  saveService,
  hireService,
  getSaved,
  getHired
};
