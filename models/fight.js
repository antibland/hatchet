const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

const fightSchema = new Schema({
  created_at: {type: Date, default: Date.now},
  type: { type: String, required: true },
  votes: {
    for: { type: Number, default: 0 },
    against: { type: Number, default: 0 }
  },
  text: {
    for: String,
    against: String
  },
  antagonist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  defender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isLive: { type: Boolean, default: false }
});

const Fight = mongoose.model('Fight', fightSchema);

module.exports = Fight;
