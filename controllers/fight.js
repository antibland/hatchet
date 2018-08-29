const Fight = require("../models/fight").Fight;
const FightExpire = require("../models/fight").FightExpire;
const User = require("../models/user");
const validator = require("email-validator");

const utils = {
  removeItemFromArray: (array, element) => {
    const index = array.indexOf(element);

    if (index !== -1) {
      array.splice(index, 1);
    }
  }
};

exports.setLive = async (req, res) => {
  let { fightId } = req.params;
  let { textAgainst } = req.body;

  let fight = await Fight.findById(fightId);

  fight.text.against = textAgainst;
  fight.isLive = true;
  fight.activatedAt = new Date();

  await fight.save((err, res) => {
    if (err) {
      return res.status(500).json({
        type: "failure",
        message: "An error occurred. Please try again."
      });
    }

    const fightExpire = new FightExpire({
      _id: res._id
    });

    fightExpire.save(err => {
      if (err) throw err;
    });
  });

  return res.status(200).json({
    type: "success",
    message: "The fight is live"
  });
};

exports.getFights = async (req, res) => {
  const fights = await Fight.find({}).populate({
    path: "antagonist defender",
    select: "username avatar"
  });

  if (!fights) {
    return res.status(500).json({
      type: "failure",
      message:
        "We can`t seem to retrive any fights right now. Try again, I guess?"
    });
  }

  fights.map(fight => {
    FightExpire.findOne({ _id: fight._id }).exec((err, doc) => {
      fight.isExpired = doc == null ? true : false;
    });
  });

  return res.status(200).json(fights);
};

exports.vote = async (req, res) => {
  const { fightId } = req.params;
  const { side, voterId } = req.body;
  let fight = null;
  let user = null;

  try {
    fight = await Fight.findById(fightId);
  } catch (err) {
    return res.status(500).json({
      type: "failure",
      message: "Fight does not exist"
    });
  }

  if (side === "for") {
    fight.votes.for = Number(fight.votes.for + 1);
  } else if (side === "against") {
    fight.votes.against = Number(fight.votes.against + 1);
  }

  await fight.save(err => {
    if (err) {
      return res.status(500).json({
        type: "failure"
      });
    }
  });

  try {
    user = await User.findById(voterId);
  } catch (err) {
    return res.status(500).json({
      type: "failure",
      message: "User not found"
    });
  }

  user.votedOn.push({
    fightId: fightId,
    side: side
  });

  await user.save(err => {
    if (err) {
      return res.status(500).json({
        type: "failure"
      });
    }
  });

  return res.status(200).json({
    type: "success",
    votes: fight.votes,
    votedOn: user.votedOn
  });
};

exports.getFight = async (req, res) => {
  let { fightId } = req.params;

  const fight = await Fight.findById(fightId).populate({
    path: "antagonist defender",
    select: "username avatar"
  });

  if (!fight) {
    return res.status(500).json({
      type: "failure",
      message:
        "You came here for a fight and got an error. WTF? Please try again."
    });
  }

  if (fight.isLive === true) {
    await FightExpire.findOne({ _id: fightId }).exec((err, doc) => {
      fight.isExpired = doc == null ? true : false;

      return res.status(200).json({
        type: "success",
        fight
      });
    });
  } else {
    return res.status(200).json({
      type: "success",
      fight
    });
  }
};

exports.getWatchedFights = async (req, res) => {
  let user = await User.findById(req.params.userId);

  await Fight.find(
    {
      _id: { $in: user.watching }
    },
    (err, fights) => {
      if (err) {
        return res.status(500).json({
          type: "failure",
          message: "An error occurred. Please try again."
        });
      } else {
        return res.status(200).json({
          fights
        });
      }
    }
  );
};

exports.getUserFights = async (req, res) => {
  let { userId } = req.params;
  let user = await User.findById(userId);
  let populateOptions = {
    path: "antagonist defender",
    select: "username avatar"
  };

  let active = await Fight.find({
    $or: [
      { $and: [{ antagonist: user }, { isLive: true }] },
      { $and: [{ defender: user }, { isLive: true }] }
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
    type: "success",
    active,
    waitingOnYou,
    waitingOnThem
  });
};

exports.deleteFight = async (req, res) => {
  let fightId = req.params.fightId;
  let user = await User.findById(req.params.userId);

  // Delete the fight
  await Fight.findByIdAndRemove(fightId, err => {
    if (err) {
      return res.status(500).json({
        type: "failure"
      });
    }

    utils.removeItemFromArray(user.fights, fightId);
  });

  // Remove the fight reference from user array
  await user.save(err => {
    if (err) {
      return res.status(500).json({
        type: "failure"
      });
    }

    return res.status(200).json({
      type: "success"
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
    text: {
      attacker: {
        do: req.body.beef,
        bother: req.body.bother,
        action: req.body.takeAction
      }
    }
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
        type: "success"
      });
    });
  };

  let oppenentRef = req.body.opponent;
  let findBy = validator.validate(oppenentRef)
    ? { email: oppenentRef }
    : { username: oppenentRef };

  opponent = await User.findOne(findBy);

  if (!opponent || opponent === null) {
    // Case: User not found via email lookup. Send an invite
    if (validator.validate(oppenentRef)) {
      console.log(`We just sent a site invitation to ${oppenentRef}...`);
      // res.status(400).json({
      //   type: 'failure',
      //   message: `We just sent a site invitation to ${oppenentRef}...`
      // });
      res.redirect("back");
    } else {
      // Case: User not found via username lookup. Give up
      console.log(`Sorry, we have no record of ${oppenentRef}`);
      // res.status(400).json({
      //   type: 'failure',
      //   message: `Sorry, we have no record of ${oppenentRef}`
      // });
      res.redirect("back");
    }
  } else {
    // Opponent exists, so continue
    fightOptions.defender = opponent;
    create();
  }
};

exports.getFightsByCategory = async (req, res) => {
  let category = req.params.category;
  let fightTypes = Fight.schema.path("type").enumValues;
  let query = null;

  fightTypes.map(type => {
    let t = type
      .toLowerCase()
      .replace(" ", "_")
      .replace("'", "");
    if (t === category) {
      query = type;
    }
  });

  if (query === null) {
    return res.status(500).json({
      type: "failure",
      fights: [],
      message: `${category} is not a valid category.`
    });
  }

  await Fight.find({ type: query }, (err, fights) => {
    let returnOptions = {
      type: "success",
      fights,
      message: fights.length === 0 ? `No results right now in ${query}` : ""
    };

    return res.status(200).json(returnOptions);
  });
};
