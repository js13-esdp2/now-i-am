const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const query = {};
    const projection = {};

    if (req.query.title) {
      query['$text'] = { $search: req.query.title };
      projection['score'] = { $meta: 'textScore' };
    }

    const categories = await Category.find(query, projection)
      .sort(projection)
      .limit(5);

    res.send(categories);
  } catch(e) {
    next(e);
  }
});

module.exports = router;