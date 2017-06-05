var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');

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
            res.redirect(`login`);
          });
      });
    });
  }
});

//login
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  knex('users')
    .select()
    .where('email', email)
    .first()
    .then(user => {
      bcrypt.compare(password, user.password, function(err, res) {
          console.log(err);
          console.log(res);
          console.log(password);
          console.log(user.password);
          console.log(user.email);
      });

      // res.render('user', {user: user})
    })
});

module.exports = router;
