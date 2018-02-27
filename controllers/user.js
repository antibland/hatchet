const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.join = (req, res, next) => {
  if (req.body.email && req.body.password) {

    var userData = {
      email: req.body.email,
      password: req.body.password
    }

    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/profile');
      }
    });
  }
};

exports.login = (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (error, user) => {
    if (error || !user) {
      let message = 'Your email or password is incorrect. It happens.';
      res.status(401).json({ message });
    } else {
      return res.json({
        message: 'success',
        token: jwt.sign({
          email: user.email,
          _id: user._id
        }, 'RESTFULAPIs')
      });
    }
  });
};

exports.logout = (req, res, next) => {
  res.end();
}
