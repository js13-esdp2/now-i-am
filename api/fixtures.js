const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Post = require('./models/Post');
const Friends = require('./models/Friends');
const {nanoid} = require("nanoid");

const run = async () => {
  await mongoose.connect(config.mongo.db, config.mongo.options);

  const collections = await mongoose.connection.db.listCollections().toArray();
  for (let coll of collections) {
    await mongoose.connection.db.dropCollection(coll.name);
  }

  const [anna, john, vasiliy] = await User.create({
    email: 'anna@gmail.com',
    password: '123',
    displayName: 'Anna',
    token: nanoid(),
    photo: 'anna.jpg',
    birthday: "23",
    sex: 'female',
    country: 'Австралия',
    role: 'user',
  }, {
    email: 'john@gmail.com',
    password: '123',
    displayName: 'John',
    token: nanoid(),
    photo: 'john.jpg',
    birthday: "23",
    sex: 'male',
    country: 'Кыргызстан',
    city: 'Ош',
    isPrivate: true,
    role: 'user',
  }, {
    email: 'vasiliy@pupkin.com',
    password: '123',
    displayName: 'Vasiliy Pupkin',
    token: nanoid(),
    photo: 'vasiy.jpg',
    birthday: "23",
    sex: 'male',
    country: 'Russian Federation',
    city: 'Moscow',
    role: 'user',
  });

  await Friends.create({
    user: anna,
    friend: vasiliy
  }, {
    user: anna,
    friend: john,
  }, {
    user: john,
    friend: vasiliy,
  }, {
    user: john,
    friend: anna
  }, {
    user: vasiliy,
    friend: john,
  }, {
    user: vasiliy,
    friend: anna,
  });

  await Post.create({
    user: anna,
    title: 'Пью кофе',
    content: 'drinkingcoffee.jpg',
    datetime: new Date().toISOString(),
    time: {
      hours: 12,
      minutes: 0,
    },
  }, {
    user: john,
    title: 'Пью чай',
    content: 'drinkingtea.jpg',
    datetime: new Date().toISOString(),
    time: {
      hours: 15,
      minutes: 10,
    },
  }, {
    user: vasiliy,
    title: 'Пью коллу',
    content: 'enjoycola.jpeg',
    datetime: new Date().toISOString(),
    time: {
      hours: 12,
      minutes: 10,
    },
  }, {
    user: vasiliy,
    title: 'Пью чай',
    content: 'drinkingtea.jpg',
    datetime: new Date().toISOString(),
    time: {
      hours: 7,
      minutes: 10,
    },
  }, {
    user: john,
    title: 'Пью коллу',
    content: 'enjoycola.jpeg',
    datetime: new Date().toISOString(),
    time: {
      hours: 15,
      minutes: 10,
    },
  }, {
    user: anna,
    title: 'Пью коллу',
    content: 'enjoycola.jpeg',
    datetime: new Date().toISOString(),
    time: {
      hours: 5,
      minutes: 0,
    },
  },);

  await mongoose.connection.close();
};

run().catch((e) => console.error(e));
