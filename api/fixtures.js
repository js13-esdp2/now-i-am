const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const {nanoid} = require("nanoid");

const run = async () => {
    await mongoose.connect(config.mongo.db, config.mongo.options);

    const collections = await mongoose.connection.db.listCollections().toArray();
    for (let coll of collections) {
        await mongoose.connection.db.dropCollection(coll.name);
    }

    await User.create({
        email: 'anna@gmail.com',
        password: '123',
        displayName: 'Anna',
        token: nanoid()
    }, {
        email: 'john@gmail.com',
        password: '123',
        displayName: 'John',
        token: nanoid()
    });

    await mongoose.connection.close();
};

run().catch((e) => console.error(e));
