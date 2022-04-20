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
        token: nanoid(),
        age: 26,
        sex: 'female',
        country: 'Австралия'
    }, {
        email: 'john@gmail.com',
        password: '123',
        displayName: 'John',
        token: nanoid(),
        age: 23,
        sex: 'male',
        country: 'Кыргызстан',
        city: 'Ош',
        isPrivate: true
    }, {
        email: 'vasiliy@pupkin.com',
        password: '123',
        displayName: 'Vasiliy Pupkin',
        token: nanoid(),
        age: 35,
        sex: 'male',
        country: 'Кыргызстан',
        city: 'Кант'
    });

    await Post.create({
        user: anna,
        title: 'test 1',
        content: 'drinkingcoffee.jpeg',
        datetime: new Date().toISOString(),
        time: {
          hours: 12,
          minutes: 0,
        },
    }, {
        user: john,
        title: 'test 2',
        content: 'drinkingtea.jpeg',
        datetime: new Date().toISOString(),
      time: {
        hours: 15,
        minutes: 10,
      },
    }, {
        user: vasiliy,
        title: 'test 3',
        content: 'enjoycola.jpg',
        datetime: new Date().toISOString(),
      time: {
        hours: 12,
        minutes: 20,
      },
    });


    await mongoose.connection.close();
};

run().catch((e) => console.error(e));
