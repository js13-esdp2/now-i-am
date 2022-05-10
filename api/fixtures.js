const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Post = require('./models/Post');
const ChatRoom = require('./models/ChatRoom');
const {nanoid} = require('nanoid');
const Message = require('./models/Message');
const Friends = require('./models/Friends');

const run = async () => {
  await mongoose.connect(config.mongo.db, config.mongo.options);

  const collections = await mongoose.connection.db.listCollections().toArray();
  for (let coll of collections) {
    await mongoose.connection.db.dropCollection(coll.name);
  }

  const [anna, john, james, caitlyn] = await User.create({
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
    birthday: 26,
    sex: 'male',
    country: 'Австралия',
    role: 'user',
  }, {
    email: 'james@gmail.com',
    password: '123',
    displayName: 'james',
    photo: 'james.jpeg',
    token: nanoid(),
    age: 23,
    birthday: "23",
    sex: 'male',
    country: 'Кыргызстан',
    city: 'Ош',
    isPrivate: true,
    role: 'user',
  }, {
    email: 'caitlyn@gmail.com',
    password: '123',
    displayName: 'Caitlyn',
    photo: 'caitlyn.jpg',
    token: nanoid(),
    birthday: "23",
    sex: 'male',
    isPrivate: true,
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
    user: james,
    title: 'Пью коллу',
    content: 'enjoycola.jpeg',
    datetime: new Date().toISOString(),
    time: {
      hours: 12,
      minutes: 10,
    },
  }, {
    user: james,
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

  const chatRoomInbox = caitlyn._id.toString() + james._id.toString();

  await ChatRoom.create({
    owner: caitlyn,
    chattingWith: james,
    name: 'James',
    chatRoomInbox: chatRoomInbox,
    lastMessage: 'Hi James!',
  })

  await ChatRoom.create({
    owner: james,
    chattingWith: caitlyn,
    name: 'Caitlyn',
    chatRoomInbox: chatRoomInbox,
    lastMessage: 'Hi James!',
  });

  await Message.create({
    chatRoomInbox: chatRoomInbox,
    text: 'Hi, James! How are you doing?',
    userFrom: anna,
    userTo: james,
    createdAt: '10 мая 2022 г., 12:00:00'
  });

  await Message.create({
    chatRoomInbox: chatRoomInbox,
    text: 'Hello Anna! Long time no see you',
    userFrom: james,
    userTo: anna,
    createdAt: '10 мая 2022 г., 12:05:00'
  });

  await mongoose.connection.close();
};

run().catch((e) => console.error(e));
