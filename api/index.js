const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const config = require('./config');
const users = require('./app/users');
const posts = require('./app/posts');
const search = require('./app/search');
const friends = require('./app/friends');

const app = express();

const corsOptions = {
  origin: (origin, callback) => { // 'http://localhost:4200'
    if (origin === undefined || config.corsWhiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use('/users', users);
app.use('/posts', posts);
app.use('/search', search);
app.use('/friends', friends);

const run = async () => {
  await mongoose.connect(config.mongo.db, config.mongo.options);

  app.listen(config.port, () => {
    console.log(`Server started on ${config.port} port!`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(e => console.error(e));