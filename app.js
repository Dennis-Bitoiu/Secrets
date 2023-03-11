/* eslint-disable arrow-parens */
/* eslint-disable object-shorthand */
/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable eol-last */
/* eslint-disable indent */

require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.urlencoded());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const secret = process.env.SECRET;

mongoose.connect('mongodb://127.0.0.1/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

userSchema.plugin(encrypt, { 
    secret: secret,
    encryptedFields: ['password'],
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    const user = new User({
        email: username,
        password: password,
    });

    user.save().then(resolved => res.render('secrets')).catch(err => console.log(err));
    
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ email: username }).then(foundUser => {
        if (foundUser) {
            if (foundUser.password === password) {
                res.render('secrets');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/');
        }
    });
});

app.listen(3000, (req, res) => {
    console.log('Server listening on port 3000');
});