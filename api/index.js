const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const config = require('./config');
const websocket = require('./classes/websocket');
const users = require('./app/users');
const posts = require('./app/posts');
const search = require('./app/search');
const chat = require('./app/chat');
const messages = require('./app/messages');
const friends = require('./app/friends');

const app = express();

require('express-ws')(app);

const corsOptions = {
  origin: (origin, callback) => {
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
app.use('/', websocket);
app.use('/users', users);
app.use('/posts', posts);
app.use('/search', search);
app.use('/chat', chat);
app.use('/messages', messages);
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
