const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const expireSchema = new Schema({
  createdAt: { type: Date, default: Date.now, expires: '24h' }
});

const fightSchema = new Schema({
  ends_at: { type: Date, default: null },
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
}, { timestamps: true });

const Fight = mongoose.model('Fight', fightSchema);
const FightExpire = mongoose.model('FightExpire', expireSchema);

module.exports = {
  Fight,
  FightExpire
};
