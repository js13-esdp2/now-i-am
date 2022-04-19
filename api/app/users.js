const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');

const config = require('../config');
const User = require('../models/User');
const auth = require('../middleware/auth');

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


router.post('/', async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName
        });

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
        req.user['age'] = req.body.age;
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

        const user = await User.findOne({ email });
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
    } catch(e) {
        return next(e);
    }
});

module.exports = router;
