//dependencies
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');

//Load user model
require('../../models/User');
const User = mongoose.model('users');

//set up routes

// @route   GET api/users/register
// @desc    User sign-in
// @access  Public
router.get('/register', (req, res) => {
  res.render('users/index');
});

// @route   POST 	api/users
// @desc    Create a user
// @access  Public
router.post('/', (req, res) => {
  let errors = [];
  const { name, email, password, password2 } = req.body;

  if (!name || !email || !password || !password2) {
    errors.push({ text: 'All fields are required' });
  }

  if (password != password2) {
    errors.push({ text: 'Passwords do no match' });
  }

  if (password.length < 4) {
    errors.push({ text: 'Passwords must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('index', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    const newUser = new User({
      name,
      email,
      password
    });

    //encrypt password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        newUser.password = hash;
        newUser
          .save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/login');
          })
          .catch(err => {
            console.error(err);
            return;
          });
      });
    });
  }
});

// @route   GET api/users/login
// @desc    User sign-in
// @access  Public
router.get('/login', (req, res) => {
  res.render('users/login');
});

// @route   POST api/users/login
// @desc    User sign-in
// @access  Public
router.post('/login', (req, res, next) => {
  //takes in a name of strategy
  //where to go if successful
  //where to go if unsuccesful
  //whether or not to display messages
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '',
    failureFlash: true
  })(req, res, next);
});

// @route   GET api/users
// @desc    List all users
// @access  Public
router.get('/', (req, res) => {
  User.find({})
    .then(users => {
      res.json(users);
    })
    .catch(err => console.error(err));
});

// @route   GET api/users/:userId
// @desc    Fetch a user
// @access  Public
router.get('/:id', (req, res) => {
  User.findOne({
    _id: req.params.id
  })
    .then(user => {
      res.json(user);
    })
    .catch(err => console.error(err));
});

// @route   PUT api/users/:userId
// @desc    Update a user
// @access  Private
router.put('/:id', (req, res) => {
  User.findOne({
    _id: req.params.id
  }).then(user => {
    //new values
    user.title = req.body.title;
    user.details = req.body.details;

    user
      .save()
      .then(user => {
        res.json(user);
      })
      .catch(err => console.error(err));
  });
});

// @route   DELETE api/users/:userId
// @desc    Delete a user
// @access  Private
router.delete('/:id', (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => {
      res.json({});
    })
    .catch(err => console.error(err));
});

// @route   GET api/users/logout
// @desc    User sign-out
// @access  Private
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//export router
module.exports = router;