const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

const { forwardAuthenticated } = require('../config/auth');
var xcheck = {
    isNotEmpty:function (str) {
        var pattern =/\S+/;
        return pattern.test(str);
    },
    email:function(str) {
        var pattern =/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        return pattern.test(str);
    },
    alphanum:function (str) {
        var pattern = /^\w+$/i;
        return pattern.test(str);
    },
    alpha:function (str) {
        var pattern = /^[A-Za-z ]+$/;
        return pattern.test(str);
    },
    number:function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str);
    }
}; 
// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const {password, password2, phone } = req.body;
  var email = req.body.email;
  var email = email.toLowerCase();
  var name = req.body.name;
  var name = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
  });
  let errors = [];
  if (!name || !email || !password || !password2 || !phone) {
    errors.push({ msg: 'Please enter all fields' });
  }else{
    if (!xcheck.email(email)) {
      errors.push({ msg: 'Invalid Email' });
    }else{
      if (!xcheck.alpha(name)) {
        errors.push({ msg: 'Name only character' });
      }else{
        if (!xcheck.number(phone)) {
          errors.push({ msg: 'Phone only number' });
        }else{
          if (password != password2) {
            errors.push({ msg: 'Passwords do not match' });
          }else{
            if (password.length < 1) {
              errors.push({ msg: 'Password must be at least 6 characters' });
            }
          }
        }
      }
    }
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      phone
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          phone,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          phone,
          status_user:'user'
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/dashboard/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: './',
    failureRedirect: '/dashboard/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/dashboard/login');
});

router.get('/', function(req,res){
  if (req.user) {
    var user = req.user;
    var status_user = user.status_user.toLowerCase();
    if (status_user=='admin') {
      res.redirect('/dashboard/admin');
    }else if(status_user=='user'){
      res.redirect('/dashboard/user');
    }else{
      req.logout();
      req.flash('success_msg', 'No permission');
      res.redirect('/dashboard/login');
    }
    
  }else{
    res.redirect('/dashboard/login')
  }
});
router.get('*', function(req,res){
  if (req.user) {
    // res.end(req.user.email);
    res.render('404');
  }else{
    res.redirect('/dashboard/login')
  }
});
module.exports = router;
