const Fight = require('../models/fight');
const User = require('../models/user');
const validator = require("email-validator");
const env = process.env.NODE_ENV || 'development';

const utils = {
  removeItemFromArray: (array, element) => {
    const index = array.indexOf(element);

    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}

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
};

exports.getWatchedFights = async(req, res) => {
  let user = await User.findById(req.params.userId);

  await Fight.find({
    '_id': { $in: user.watching }
  }, (err, fights) => {
    if (err) {
      return res.status(500).json({
        type: 'failure',
        message: 'An error occurred. Please try again.'
      });
    } else {
      return res.status(200).json({
        fights
      });
    }
  })
};

exports.getUserFights = async (req, res) => {
  let { userId } = req.params;
  let user = await User.findById(userId);
  let populateOptions = {
    path: 'antagonist defender',
    select: 'username avatar'
  };

  let active = await Fight.find({
    $or: [
      { $and: [{antagonist: user}, {isLive: true}] },
      { $and: [{defender: user}, {isLive: true}] }
    ]
  });
  let waitingOnYou = await Fight.find({
    defender: userId,
    isLive: false
  }).populate(populateOptions);
  let waitingOnThem = await Fight.find({
    antagonist: userId,
    isLive: false
  }).populate(populateOptions);

  return res.status(200).json({
    type: 'success',
    active,
    waitingOnYou,
    waitingOnThem
  });
};

exports.deleteFight = async(req, res) => {
  let fightId = req.params.fightId;
  let user = await User.findById(req.params.userId);

  // Delete the fight
  let fight = await Fight.findByIdAndRemove(fightId, err => {
    if (err) {
      return res.status(500).json({
        type: 'failure'
      });
    }

    utils.removeItemFromArray(user.fights, fightId);
  });

  // Remove the fight reference from user array
  await user.save(err => {
    if (err) {
      return res.status(500).json({
        type: 'failure'
      });
    }

    return res.status(200).json({
      type: 'success'
    });
  });
};

exports.newFight = async (req, res) => {
  let user = await User.findById(req.params.userId);
  let opponent = null;

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
      return res.status(200).json({
        type: 'success'
      });
    });
  };


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

exports.getFightsByCategory = async (req, res) => {
  let category = req.params.category;
  let fightTypes = Fight.schema.path('type').enumValues;
  let query = null;

  fightTypes.map( (type, index) => {
    let t = type.toLowerCase().replace(' ', '_').replace('\'', '');
    if (t === category) {
      query = type;
    }
  });

  if (query === null) {
    return res.status(500).json({
      type: 'failure',
      fights: [],
      message: `${category} is not a valid category.`
    });
  }

  await Fight.find({"type":query}, (err, fights) => {
    let returnOptions = {
      type: 'success',
      fights,
      message: fights.length === 0 ? `No results right now in ${query}` : ''
    };

    return res.status(200).json(returnOptions);
  });
};
