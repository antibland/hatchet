const Fight = require('../models/fight');
const User = require('../models/user');

exports.getFights = async (req, res) => {
  await Fight.find({}, (err, fights) => {
    if (err) throw err;
    res.status(200).json(fights);
  })
}

exports.getFight = async (req, res) => {
  let { fightId } = req.params;
  await Fight.find(fightId);

  if (fight) {
    res.status(200).json({
      type: 'success',
      fight
    });
  }
}

exports.getUserFights = async (req, res) => {
  let { userId } = req.params;
  let user = await User.findById(userId).populate('fights');

  if (user) {
    res.status(200).json({
      type: 'success',
      fights: user.fights
    });
  }
}

exports.newFight = async (req, res) => {
  let user = await User.findById(req.params.userId);

  let fight = await new Fight({
    type: req.body.type,
    antagonist: user,
    text: {
      for: req.body.beef
    }
  });

  await fight.save(err => {
    if (err) throw err;
  });

  await user.fights.push(fight);
  await user.save(err => {
    if (err) throw err;
    const data = {type: 'success', message: 'it worked'};
    res.redirect('back');
  });
}
