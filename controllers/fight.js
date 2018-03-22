const Fight = require('../models/fight');
const User = require('../models/user');
const validator = require("email-validator");
const env = process.env.NODE_ENV || 'development';

exports.setLive = async (req, res) => {
  let { fightId } = req.params;

  let fight = await Fight.findById(fightId);
  fight.isLive = true;

  await fight.save(err => {
    if (err) {
      return res.status(500).json({
        type: 'failure',
        message: 'An error occurred. Please try again.'
      });
    }
  });

  return res.status(200).json({
    type: 'success',
    message: 'The fight is live'
  });
};

exports.getFights = async (req, res) => {
  await Fight.find({}, (err, fights) => {
    if (err) throw err;
    res.status(200).json(fights);
  });
};

exports.getFight = async (req, res) => {
  let { fightId } = req.params;

  let fight = await Fight.findById(fightId)
    .populate({
      path: 'antagonist defender', select: 'username avatar'
    });

  if (!fight) {
    return res.status(500).json({
      type: 'failure',
      message: 'You came here for a fight and got an error. WTF? Please try again.'
    });
  }

  return res.status(200).json({
    type: 'success',
    fight
  });
}

exports.getUserFights = async (req, res) => {
  let { userId } = req.params;
  let user = await User.findById(userId).populate('fights');
  let pendingInvites = await Fight.find({
    defender: userId,
    isLive: false
  });

  if (user) {
    res.status(200).json({
      type: 'success',
      fights: user.fights,
      pendingInvites
    });
  }
}

exports.newFight = async (req, res) => {
  let user = await User.findById(req.params.userId);
  let opponent = null;
  let target = req.body.target;

  // default fight options
  let fightOptions = {
    type: req.body.type,
    title: req.body.title,
    antagonist: user,
    text: { for: req.body.beef }
  };

  const create = async () => {
    let fight = await new Fight(fightOptions);

    await user.fights.push(fight);

    await fight.save(err => {
      if (err) throw err;
    });

    await user.save(err => {
      if (err) throw err;
      res.redirect('back');
    });
  };

  if (target === 'world') {
    fightOptions.isLive = true;
    create();
  } else if (target === 'someone') {
    let oppenentRef = req.body.opponent;
    let findBy = validator.validate(oppenentRef)
                  ? { email: oppenentRef }
                  : { username: oppenentRef };

    opponent = await User.findOne(findBy);
    //console.log('opponent', opponent);

    if (!opponent || opponent === null) {
      // Case: User not found via email lookup. Send an invite
      if (validator.validate(oppenentRef)) {
        console.log(`We just sent a site invitation to ${oppenentRef}...`);
        // res.status(400).json({
        //   type: 'failure',
        //   message: `We just sent a site invitation to ${oppenentRef}...`
        // });
        res.redirect('back');
      } else {
        // Case: User not found via username lookup. Give up
        console.log(`Sorry, we have no record of ${oppenentRef}`);
        // res.status(400).json({
        //   type: 'failure',
        //   message: `Sorry, we have no record of ${oppenentRef}`
        // });
        res.redirect('back');
      }
    } else {
      // Opponent exists, so continue
      fightOptions.defender = opponent;
      create();
    }
  }

}
