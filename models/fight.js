const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

const antagonistSchema = new Schema({
  username: String,
  email: {type: String, required: true},
  text: String,
  votes: {type: Number, default: 0}
});

const defenderSchema = new Schema({
  username: String,
  email: String,
  text: String,
  votes: {type: Number, default: 0}
});

const fightSchema = new Schema({
  created_at: {type: Date, default: Date.now},
  title: { type: String, required: true, unique: true },
  antagonist: {
    username: String,
    email: {type: String, required: true},
    text: String,
    votes: {type: Number, default: 0}
  },
  defender: {
    username: String,
    email: String,
    text: String,
    votes: {type: Number, default: 0}
  }
});

const Fight = mongoose.model('Fight', fightSchema);

module.exports = Fight;
