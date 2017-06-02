var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.use(expressValidator());

const knex = require('../db/knex');

//register
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  var fullname = req.body.fullname;
  var email = req.body.email;
  var password = req.body.password;

  req.checkBody('fullname', 'Full name must be specified.').notEmpty();
  req.checkBody('email', 'Email must be specified.').notEmpty();
  req.checkBody('password', 'Password must be specified.').notEmpty();


  var errors = req.validationErrors();
  if (errors) {
    res.render('signup', {
      errors: errors
    });
  } else {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash('B4c0/\/', salt, function(err, hash) {
        const user = {
          fullname: fullname,
          email: email,
          password: hash,
          created_at: new Date(),
          updated_at: new Date()
        }
        knex('users')
          .insert(user, 'id')
          .then(ids => {
            id = ids[0];
            res.redirect(`/users/${id}`);
          });
      });
    });
  }
});

//login
router.get('/login', function(req, res, next) {
  res.render('login');
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login'}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	res.redirect('/users/login');
});

module.exports = router;
