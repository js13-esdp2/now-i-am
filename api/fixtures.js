const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Post = require('./models/Post');
const {nanoid} = require("nanoid");

const run = async () => {
    await mongoose.connect(config.mongo.db, config.mongo.options);

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (let coll of collections) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    const[anna, john, vasiliy] = await User.create({
        email: 'anna@gmail.com',
        password: '123',
        displayName: 'Anna',
        token: nanoid()
    }, {
        email: 'john@gmail.com',
        password: '123',
        displayName: 'John',
        token: nanoid()
    }, {
      email: 'vasiliy@pupkin.com',
      password: '123',
      displayName: 'Vasiliy Pupkin',
      token: nanoid(),
    });

    await Post.create({
      user: anna,
      title: 'test 1',
      image: 'drinkingcoffee.jpeg',
      datetime: new Date(),
      time: '30',
    }, {
      user: john,
      title: 'test 2',
      image: 'drinkingtea.jpeg',
      datetime: new Date(),
      time: '60',
    }, {
      user: vasiliy,
      title: 'test 3',
      image: 'enjoycola.jpg',
      datetime: new Date(),
      time: '',
    });

    await mongoose.connection.close();
};

run().catch((e) => console.error(e));
