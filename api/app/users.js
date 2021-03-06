const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const User = require('../models/User');
const config = require('../config');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const {nanoid, customAlphabet} = require('nanoid');
const auth = require('../middleware/auth');
require('dotenv').config();
const nodemailer = require('nodemailer');
const Post = require('../models/Post');



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

const router = express.Router();
const upload = multer({storage});

router.get('/', async (req, res, next) => {
  try {
      const users = await User.find();
      return res.send(users);
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.params.id});
    return res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

router.get('/recovery/:email', async (req, res, next) => {
  try {

    const userData = await User.findOne({email: req.params.email});

    if (!userData) {
      return res.status(400).send({error: "Вы не зарегистрированы!"});
    }

    const codeForUser = customAlphabet('123456789', 6);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: 'nowiam07@gmail.com',
      to: req.params.email,
      subject: "Востановление пароля от приложения 'Now I Am'",
      text: codeForUser()
    }

    transporter.sendMail(mailOptions)

    await User.updateOne({_id: userData._id}, {code: mailOptions.text});

    const recoveryData = {
      code: mailOptions.text,
      email: userData.email,
    }

    return res.send(recoveryData);
  } catch (e) {
    return next(e);
  }
});

router.get('/check-code/:code', async (req, res, next) => {
  try {
    const userData = await User.findOne({code: req.params.code});

    if (!userData){
      return res.status(400).send({error: "Код активации неверный!"});
    }

    const user = await User.updateOne({code: req.params.code}, {code: 0});

    return res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});



router.post('/', async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
    });

    await user.generatePhoto();

    user.generateToken();

    await user.save();

    return res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

router.post('/edit-profile', auth, upload.single('photo'), async (req, res, next) => {
  try {
    req.user['displayName'] = req.body.displayName;
    req.user['birthday'] = req.body.birthday;
    req.user['sex'] = req.body.sex;
    req.user['country'] = req.body.country;
    req.user['city'] = req.body.city;
    req.user['aboutMe'] = req.body.aboutMe;
    req.user['isPrivate'] = req.body.isPrivate || false

    if (req.body.photo === '') req.user['photo'] = req.body.photo;
    else if (req.file !== undefined) req.user['photo'] = req.file.filename;

    await req.user.save();
    return res.send(req.user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

router.post('/sessions', async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).send({error: 'Неверный логин или пароль'});
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(400).send({error: 'Неверный логин или пароль'});
    }

    user.generateToken();
    await user.save();

    return res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

router.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    if (!token) {
      return res.send({message: 'ok'});
    }

    const user = await User.findOne({token});
    if (!user) {
      return res.send({message: 'ok'});
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'ok'});
  } catch (e) {
    return next(e);
  }
});

router.post('/facebookLogin', async (req, res, next) => {
  try {
    const inputToken = req.body.authToken;
    const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;

    const response = await axios.get(debugTokenUrl);

    if (response.data.data.error) {
      return res.status(401).send({message: 'Facebook token incorrect'});
    }

    if (req.body.id !== response.data.data.user_id) {
      return res.status(401).send({message: 'Wrong User ID'});
    }

    let user = await User.findOne({email: req.body.email});

    if (!user) {
      user = await User.findOne({facebookId: req.body.id});
    }

    if (!user) {
      const userData = {
        email: req.body.email,
        password: nanoid(),
        displayName: req.body.name,
        facebookId: req.body.id,
      };

      if (req.body.photoUrl) {
        const photo = await axios.get(req.body.photoUrl, {responseType: 'stream'});
        const photoName = nanoid() + '.jpg';

        const photoPath = path.resolve(config.uploadPath, photoName);
        photo.data.pipe(fs.createWriteStream(photoPath));

        userData['photo'] = photoName;
      }

      user = new User(userData);

      user.generateToken();
      await user.save();
    }

    res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

router.post('/googleLogin', async (req, res, next) => {
  try {
    const authToken = req.body.authToken;
    const debugTokenUrl = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${authToken}`;

    const response = await axios.get(debugTokenUrl);

    if (response.data.error) {
      return res.status(401).send({message: 'Google token incorrect'});
    }

    if (response.data.user_id !== req.body.id) {
      return res.status(401).send({message: 'Wrong user id'});
    }

    let user = await User.findOne({email: req.body.email});

    if (!user) {
      user = await User.findOne({googleId: req.body.id});
    }

    if (!user) {
      const userData = {
        email: req.body.email,
        password: nanoid(),
        displayName: req.body.name,
        googleId: req.body.id,
      };

      if (req.body.photoUrl) {
        const photo = await axios.get(req.body.photoUrl, {responseType: 'stream'});
        const photoName = nanoid() + '.jpg';

        const photoPath = path.resolve(config.uploadPath, photoName);
        photo.data.pipe(fs.createWriteStream(photoPath));

        userData['photo'] = photoName;
      }

      user = new User(userData);

      user.generateToken();
      await user.save();
    }

    res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

router.post('/vkLogin', async (req, res, next) => {
  try {
    const authToken = req.body.authToken;
    const access_tokenURL = `https://api.vk.com/oauth/access_token?v=5.21&client_id=${config.vk.appId}&client_secret=${config.vk.appSecret}&grant_type=client_credentials`
    const responseToken = await axios.get(access_tokenURL);
    const debugTokenUrl = `https://api.vk.com/method/secure.checkToken?access_token=${responseToken.data.access_token}&client_secret=${config.vk.appSecret}&v=5.131&client_id=${req.body.id}&token=${authToken}`;
    const response = await axios.get(debugTokenUrl);
    if (response.data.error) {
      return res.status(401).send({message: 'VK token incorrect'});
    }

    if (response.data.response.user_id !== req.body.id) {
      return res.status(401).send({message: 'Wrong user id'});
    }

    if (req.body.provider === 'VK') {
      let user = await User.findOne({vkId: req.body.id});
      if (!user) {
        const userData = {
          email: req.body.id + '@vk.com',
          password: nanoid(),
          displayName: req.body.name,
          vkId: req.body.id,
        };

        if (req.body.photoUrl) {
          const photo = await axios.get(req.body.photoUrl, {responseType: 'stream'});
          const photoName = nanoid() + '.jpg';

          const photoPath = path.resolve(config.uploadPath, photoName);
          photo.data.pipe(fs.createWriteStream(photoPath));

          userData['photo'] = photoName;
        }

        user = new User(userData);
        user.generateToken();
        await user.save();
        res.send(user);
      }
    }
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
})

router.post('/addFriend', auth, async (req, res, next) => {
  try {
    const friendUser = await User.findById(req.body.userId);
    if (!friendUser) {
      return res.status(400).send({error: 'Пользователь с таким ID отсутствует'});
    }

    if (friendUser._id === req.user._id) {
      return res.status(400).send({error: 'Вы не можете отправить запрос на дружбу себе'});
    }

    const checkFriend = req.user.friendRequests.find((friend) => friend.user.equals(friendUser._id));
    if (checkFriend) {
      return res.send(req.user);
    }

    req.user.friendRequests.push({user: friendUser._id});

    await req.user.save();

    res.send(req.user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    next(e);
  }
});

router.post('/changePassword', async (req, res, next) => {
  try {

    let user = await User.findOne({ email: req.body.email});

    if (req.body.currentPassword){
      const isMatch = await user.checkPassword(req.body.currentPassword);

      if (!isMatch) {
        return res.status(400).send({error: 'Вы ввели неверный текущий пароль'});
      }

      const passwordsIsMatch = await user.passwordMatchingCheck(req.body.newPassword, req.body.currentPassword);

      if(passwordsIsMatch) {
        return res.status(400).send({error: 'Пароли совпадают, введите новый пароль'});
      }
    }

    user.password = req.body.newPassword;
    user.save();

    res.send(user);
  } catch (e) {
    next(e);
  }
});


router.post('/usersId', async (req, res, next) => {
  try {
    console.log(req.body.users);
    const users = await User.find({id: req.body.users})
    return res.send(users);
  } catch (e) {
    next(e);
  }
})

router.get('/checkIfUserIsOnline/:userId', async (req, res, next) => {
  try{
    const posts = await Post.find({user: req.params.userId});

    if (posts.length === 0){
      return res.status(400).send({error: 'Добавьте занятие'});
    }
    return res.send(posts)

  } catch (e) {
    return next(e);
  }
})

module.exports = router;
