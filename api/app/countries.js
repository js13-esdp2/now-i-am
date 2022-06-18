const express = require('express');
const Countries = require('../models/Countries');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const countries = await Countries.find();
    return res.send(countries);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;