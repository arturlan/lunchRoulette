var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator());

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
    
  }
});

//login
router.get('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
