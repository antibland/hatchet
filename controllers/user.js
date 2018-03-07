const User = require('../models/user');
const Token = require('../models/verification');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// helper function

const sendEmail = (opts) => {
  const req = opts.req;
  const res = opts.res;
  const token = opts.token;
  const user = opts.user;

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS // generated ethereal password
    }
  });

  let mailOptions = {
    from: 'no-reply@yourwebapplication.com',
    to: user.email,
    subject: 'Account Verification Token',
    text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api\/confirmation\/' + token.token + '.\n'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.json({
      type: 'success',
      message: 'We\'ve just emailed you a verification link. Make things real!'
    });
  });
}

exports.join = (req, res, next) => {
  if (req.body.username && req.body.email && req.body.password) {

    const regex = /^[a-zA-Z0-9_.-]*$/g;
    if (!regex.test(req.body.username)) {
      return res.status(401).json({
        type: 'failure',
        message: 'Sorry, but this username contains invalid characters.'
      });
    }

    var userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }

    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        res.status(401).json({
          type: 'failure',
          message: 'The username or email address is not unique.'
        });
      } else {

        // Create a verification token for this user
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the verification token
        token.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          sendEmail({ req, res, token, user });
        });
      }
    });
  }
};

exports.login = (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (error, user) => {
    if (error || !user) {
      return res.status(401).json({
        type: 'failure',
        message: 'Your email or password is incorrect. It happens.'
      });
    } else {

      if (!user.isVerified) {
        return res.status(401).json({
          type: 'failure',
          message: 'Almost there. Please check your email and verify your account.'
        });
      }

      const token = jwt.sign({
        email: user.email,
        _id: user._id
      }, 'RESTFULAPIs');

      return res.json({
        type: 'success',
        token,
        user: {
          userid: user._id,
          username: user.username
        }
      });
    }
  });
};

exports.reset_password = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec(function (err, user) {
      if (err) {
        res.status(401).json({
          type: 'failure',
          message: 'A system error occurred. We are looking into it.'
        });
      } else if (!user) {
        res.status(401).json({
          type: 'failure',
          message: `There is no account associated with ${req.body.email}.`
        });
      } else {
        // Generate password reset email and send email it
        res.json({
          type: 'success',
          message: `A link to reset your password has been sent to ${req.body.email}.`
        })
      }
    });
}

exports.logout = (req, res, next) => {
  res.end();
}

exports.confirmationPost = function (req, res, next) {

  // Find a matching token
  Token.findOne({ token: req.params.token_id }, function (err, token) {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
        if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }
          let data = {
            type: 'success',
            message: 'The account has been verified. Please log in.'
          };

          res.status(200).send("The account has been verified! Please log in.");
        });
    });
  });
};

exports.resendTokenPost = function (req, res, next) {
  User.findOne({ email: req.body.email }, function (err, user) {
      if (!user) return res.status(400).send({
        type: 'failure',
        message: 'We were unable to find a user with that email.'
      });
      if (user.isVerified) return res.status(400).send({
        type: 'success',
        message: 'This account has already been verified. Please log in.'
      });

      // Create a verification token, save it, and send email
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the token
      token.save(function (err) {
        sendEmail({ req, res, token, user });
      });
  });
};
