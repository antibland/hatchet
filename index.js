const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

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
  const data = { name: 'Andy', state: 'Oregon'};

  res.json(data);
});

app.post('/api/create/fight', (req, res) => {
  let f = new Fight({
    title: 'Test',
    antagonist: {
      username: 'OfficeDemon01',
      email: 'jackhammer@ee.com'
    }
  });

  f.save(err => {
    if (err) throw err;
    const data = {type: 'success', message: 'it worked'};

    res.json(data)
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
