const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const fightSchema = new Schema({
  created_at: {type: Date, default: Date.now},
  type: {
    type: String,
    required: [true, 'Invalid type' ],
    enum: ['Lover\'s Quarrel',
          'Workplace Squabble',
          'Friend Fight',
          'Roommate Rumble',
          'Family Feud',
          'World War']
  },
  title: { type: String, required: true },
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
