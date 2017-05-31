var express = require('express');
var router = express.Router();

//register
router.get('/register', function(req, res, next) {
  res.render('register');
});

//login
router.get('/login', function(req, res, next) {
  res.render('/auth/login');
});
module.exports = router;
