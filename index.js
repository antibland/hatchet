const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

//const MongoStore = require('connect-mongo')(session);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

const fightApi = require('./controllers/fight.js');
app.get('/api/fights', fightApi.getFights);
app.post('/api/fight', fightApi.newFight);

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
