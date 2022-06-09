const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Post = require('./models/Post');
const ChatRoom = require('./models/ChatRoom');
const {nanoid} = require('nanoid');
const Message = require('./models/Message');
const Friends = require('./models/Friends');
const Comment = require('./models/Comment');
const Category = require('./models/Category');

const run = async () => {
  await mongoose.connect(config.mongo.db, config.mongo.options);

  const collections = await mongoose.connection.db.listCollections().toArray();
  for (let coll of collections) {
    await mongoose.connection.db.dropCollection(coll.name);
  }

  const [anna, john, james, caitlyn, cara] = await User.create({
    email: 'anna@gmail.com',
    password: '123',
    displayName: 'Anna',
    token: nanoid(),
    photo: 'anna.jpeg',
    birthday: '23',
    sex: 'female',
    country: 'Russia',
    city: 'MOSCVA',
    role: 'moderator',
  }, {
    email: 'john@gmail.com',
    password: '123',
    displayName: 'John',
    photo: 'john.jpg',
    token: nanoid(),
    birthday: 26,
    sex: 'male',
    country: 'Kyrgyzstan',
    city: 'BISHKEK',
    role: 'user',
  }, {
    email: 'james@gmail.com',
    password: '123',
    displayName: 'James',
    photo: 'james.jpeg',
    token: nanoid(),
    age: 23,
    birthday: '23',
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
    birthday: '23',
    sex: 'male',
    isPrivate: true,
    country: 'Russian Federation',
    city: 'Moscow',
    role: 'user',
  }, {
    email: 'cara@gmail.com',
    password: '123',
    displayName: 'Cara',
    photo: 'cara.jpg',
    token: nanoid(),
    birthday: '23',
    sex: 'female',
    isPrivate: true,
    country: 'Russian Federation',
    city: 'Moscow',
    role: 'user',
  });

  await Friends.create({
    user: anna,
    friend: james,
  }, {
    user: anna,
    friend: john,
  }, {
    user: john,
    friend: james,
  }, {
    user: john,
    friend: anna
  }, {
    user: james,
    friend: john,
  }, {
    user: james,
    friend: anna,
  });

  const [coffeeCat, teaCat, colaCat, netflixCat] = await Category.create({
    title: 'Пью кофе',
    posts: 1
  }, {
    title: 'Пью чай',
    posts: 2
  }, {
    title: 'Пью коллу',
    posts: 3
  }, {
    title: 'Смотрю Neflix',
    posts: 1
  });

  const hours = 0;
  const minutes = 1;
  const timer = (hours * 3600) + (minutes * 60);
  const invisibleAtUnixTime = Math.round((new Date().getTime() / 1000)) + timer;
  const invisibleDate = new Date((invisibleAtUnixTime * 1000)).toString();

  const [Comm1, Comm2, Comm3] = await Comment.create(
    {
      user: anna,
      text: "Hello"
    },
    {
      user: james,
      text: "How are you?"
    },
    {
      user: anna,
      text: "Goodbye"
    },
  )

  await Post.create({
    user: anna,
    categoryId: coffeeCat,
    title: 'Пью кофе',
    content: 'drinkingcoffee.jpg',
    datetime: new Date().toISOString(),
    createdAt: new Date().getTime(),
    isVisible: true,
    invisibleAtUnixTime: invisibleAtUnixTime,
    invisibleDate: invisibleDate,
    time: {
      hours: 12,
      minutes: 0,
    },
  }, {
    user: john,
    categoryId: teaCat,
    title: 'Пью чай',
    content: 'drinkingtea.jpg',
    datetime: new Date().toISOString(),
    createdAt: new Date().getTime(),
    isVisible: true,
    invisibleAtUnixTime: invisibleAtUnixTime + 60,
    invisibleDate: invisibleDate,
    time: {
      hours: 15,
      minutes: 10,
    },
  }, {
    user: james,
    categoryId: colaCat,
    title: 'Пью коллу',
    content: 'enjoycola.jpeg',
    datetime: new Date().toISOString(),
    createdAt: new Date().getTime(),
    isVisible: true,
    invisibleAtUnixTime: invisibleAtUnixTime + 120,
    invisibleDate: invisibleDate,
    time: {
      hours: 12,
      minutes: 10,
    },
    geolocation: {
      lat: 42.844748,
      lng: 74.543953
    }
  }, {
    user: james,
    categoryId: teaCat,
    title: 'Пью чай',
    content: 'drinkingtea.jpg',
    datetime: new Date().toISOString(),
    createdAt: new Date().getTime(),
    isVisible: true,
    invisibleAtUnixTime: invisibleAtUnixTime + 180,
    invisibleDate: invisibleDate,
    time: {
      hours: 7,
      minutes: 10,
    },
  }, {
    user: john,
    categoryId: colaCat,
    title: 'Пью коллу',
    content: 'enjoycola.jpeg',
    datetime: new Date().toISOString(),
    createdAt: new Date().getTime(),
    isVisible: true,
    invisibleAtUnixTime: invisibleAtUnixTime + 240,
    invisibleDate: invisibleDate,
    time: {
      hours: 15,
      minutes: 10,
    },
    geolocation: {
      lat: 42.848022,
      lng: 74.645576
    }
  }, {
    user: anna,
    categoryId: colaCat,
    title: 'Пью коллу',
    content: 'enjoycola.jpeg',
    datetime: new Date().toISOString(),
    createdAt: new Date().getTime(),
    isVisible: true,
    invisibleAtUnixTime: invisibleAtUnixTime + 300,
    invisibleDate: invisibleDate,
    time: {
      hours: 5,
      minutes: 0,
    },
  }, {
    user: cara,
    categoryId: netflixCat,
    title: 'Смотрю Neflix',
    content: 'watching-neflix.jpg',
    datetime: new Date().toISOString(),
    createdAt: new Date().getTime(),
    isVisible: true,
    invisibleAtUnixTime: invisibleAtUnixTime + 300,
    invisibleDate: invisibleDate,
    time: {
      hours: 5,
      minutes: 0,
    },
    geolocation: {
      lat: 42.876474,
      lng: 74.637337
    },
    commenst: [Comm1, Comm2, Comm3]
  },
)

  const firstChatRoomInbox = caitlyn._id.toString() + james._id.toString();
  const secondChatRoomInbox = caitlyn._id.toString() + cara._id.toString();
  const thirdChatRoomInbox = james._id.toString() + cara._id.toString();
  const forthChatRoomInbox = james._id.toString() + john._id.toString();
  const fifthChatRoomInbox = john._id.toString() + caitlyn._id.toString();
  const sixthChatRoomInbox = john._id.toString() + cara._id.toString();

  const [messageFromCaitlyn, messageFromJohn] = await Message.create({
    chatRoomInbox: firstChatRoomInbox,
    text: 'Hi, James! How are you doing?',
    userFrom: caitlyn,
    userTo: james,
    isRead: true,
    createdAt: '10 мая 2022 г., 12:00:00'
  }, {
    chatRoomInbox: firstChatRoomInbox,
    text: 'Hello Caitlyn! Not bad',
    userFrom: james,
    userTo: caitlyn,
    isRead: true,
    createdAt: '10 мая 2022 г., 12:05:00'
  });



  await ChatRoom.create({
    owner: caitlyn,
    chattingWith: james,
    name: 'James',
    chatRoomInbox: firstChatRoomInbox,
    lastMessage: 'Hello Caitlyn! Not bad',
    messages: [
      messageFromCaitlyn,
      messageFromJohn
    ]
  }, {
    owner: james,
    chattingWith: caitlyn,
    name: 'Caitlyn',
    chatRoomInbox: firstChatRoomInbox,
    lastMessage: 'Hello Caitlyn! Not bad',
    messages: [
      messageFromCaitlyn,
      messageFromJohn
    ]
  }, {
    owner: caitlyn,
    chattingWith: cara,
    name: 'Cara',
    chatRoomInbox: secondChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: cara,
    chattingWith: caitlyn,
    name: 'Caitlyn',
    chatRoomInbox: secondChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: james,
    chattingWith: cara,
    name: 'Cara',
    chatRoomInbox: thirdChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: cara,
    chattingWith: james,
    name: 'James',
    chatRoomInbox: thirdChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: james,
    chattingWith: john,
    name: 'John',
    chatRoomInbox: forthChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: john,
    chattingWith: james,
    name: 'James',
    chatRoomInbox: forthChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: john,
    chattingWith: caitlyn,
    name: 'Caitlyn',
    chatRoomInbox: fifthChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: caitlyn,
    chattingWith: john,
    name: 'John',
    chatRoomInbox: fifthChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: john,
    chattingWith: cara,
    name: 'Cara',
    chatRoomInbox: sixthChatRoomInbox,
    lastMessage: '',
    messages: []
  }, {
    owner: cara,
    chattingWith: john,
    name: 'John',
    chatRoomInbox: sixthChatRoomInbox,
    lastMessage: '',
    messages: []
  },)


  await mongoose.connection.close();
};

run().catch((e) => console.error(e));
