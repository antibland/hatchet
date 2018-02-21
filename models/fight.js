const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

const fightSchema = new Schema({
  created_at: {type: Date, default: Date.now},
  type: { type: String, required: true },
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
