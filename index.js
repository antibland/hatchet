const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Models
const Fight = require('./models/fight.js');
const User = require('./models/user.js');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));


// connect to Mongo when the app initializes
if (app.get('env') === 'development') {
  mongoose.connect('mongodb://localhost/jdi');
} else if (app.get('env') === 'production')  {
  // connect to production database
}

// Put all API endpoints under '/api'
app.get('/api/test', (req, res) => {
  //console.log(req.body.name)
  // console.log('hey')
  // console.log(req.body.beef)
  const data = { name: 'Andy', state: 'Oregon'};

  res.json(data);
});

app.get('/api/show/fights', (req, res) => {
  Fight.find({}, (err, fights) => {
    if (err) throw err;
    res.json(fights);
  });
});

app.post('/api/create/fight', (req, res) => {
  let f = new Fight({
    type: req.body.type,
    antagonist: {
      username: 'admin',
      email: 'jackhammer@ee.com',
      text: req.body.beef
    }
  });

  f.save(err => {
    if (err) throw err;
    const data = {type: 'success', message: 'it worked'};

    res.redirect('back');
  });
});

app.post('/api/create/user', (req, res) => {
  // create a user a new user
  let testUser = new User({
    username: 'jmar777',
    password: 'Password123'
  });

  // save user to database
  testUser.save(function(err) {
    if (err) throw err;

    // fetch user and test password verification
    User.findOne({ username: 'jmar777' }, function(err, user) {
      if (err) throw err;

      // test a matching password
      user.comparePassword('Password123', function(err, isMatch) {
        if (err) throw err;
        console.log('Password123:', isMatch); // -> Password123: true
      });

      // test a failing password
      user.comparePassword('123Password', function(err, isMatch) {
        if (err) throw err;
        console.log('123Password:', isMatch); // -> 123Password: false
      });
    });
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
