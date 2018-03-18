const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const env = process.env.NODE_ENV || 'development';
//const MongoStore = require('connect-mongo')(session);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// dotenv
if (env === 'development') {
  require('dotenv').config();
}

// connect to Mongo when the app initializes
if (env === 'development') {
  mongoose.connect('mongodb://localhost/jdi');
} else if (env === 'production')  {
  mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds263408.mlab.com:63408/hatchet',
  { useMongoClient: true })
}

var db = mongoose.connection || null;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const upload = require('./multer_config')(app);

const fightApi = require('./controllers/fight.js');
app.get('/api/fights', fightApi.getFights);
app.get('/api/:fightId/fight', fightApi.getFight);
app.post('/api/:userId/fight', fightApi.newFight);
app.get('/api/:userId/fights', fightApi.getUserFights);

const userApi = require('./controllers/user.js');
app.post('/api/join', userApi.join);
app.post('/api/login', cors(), userApi.login);
app.post('/api/reset_password', userApi.reset_password);
app.get('/api/:userId/logout', userApi.logout);
app.get('/api/confirmation/:token_id', userApi.confirmationPost);
app.post('/api/resend', userApi.resendTokenPost);
app.get('/api/:userId/avatar', userApi.getAvatar);
app.get('/api/:userId', userApi.getUser);
app.post('/api/:userId/avatar', upload.single('avatar'), userApi.setAvatar);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
