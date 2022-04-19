const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();


router.post('/', async (req, res, next) => {
  try {
    const searchData = req.body.searchData

    console.log(searchData);

    const users = await User.find()

    return res.send(users);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

module.exports = router;
