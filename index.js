const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//const MongoStore = require('connect-mongo')(session);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Models
const Fight = require('./models/fight');

// dotenv
if (app.get('env') === 'development') {
  require('dotenv').config();
}

// connect to Mongo when the app initializes
if (app.get('env') === 'development') {
  mongoose.connect('mongodb://localhost/jdi');
} else if (app.get('env') === 'production')  {
  // connect to production database
}

var db = mongoose.connection || null;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api/test', (req, res) => {
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

const userApi = require('./controllers/user.js');

app.post('/api/join', userApi.join);
app.post('/api/login', cors(), userApi.login);
app.post('/api/reset_password', userApi.reset_password);
app.get('/api/logout', userApi.logout);

app.get('/api/confirmation/:token_id', userApi.confirmationPost);
app.post('/api/resend', userApi.resendTokenPost);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
