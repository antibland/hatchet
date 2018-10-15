const Fight = require("../models/fight").Fight;
const FightExpire = require("../models/fight").FightExpire;
const User = require("../models/user");
const validator = require("email-validator");
const schedule = require("node-schedule");

const utils = {
  removeItemFromArray: (array, element) => {
    const index = array.indexOf(element);

    if (index !== -1) {
      array.splice(index, 1);
    }
  }
};

const scheduleJob = fightId => {
  let startTime = new Date(Date.now());
  let endTime = new Date(startTime.getTime() + 1 * 24 * 60 * 60 * 1000);
  //let endTime = new Date(startTime.getTime() + 30000);

  schedule.scheduleJob(endTime, function() {
    const errorJSON = (message, type = "failure") => {
      return {
        type,
        message
      };
    };

    Fight.findById(fightId)
      .populate({
        path: "antagonist defender",
        select: "_id"
      })
      .then(fight => {
        const updateUserRecord = (side, instruction) => {
          User.findOneAndUpdate(
            { _id: fight[side]._id },
            {
              $inc: {
                [instruction]: 1
              }
            }
          )
            .then(user => {
              if (!user) {
                console.error("User record not updated");
              }
            })
            .catch(err => {
              console.error(err);
            });
        };

        let result =
          fight.votes.for === fight.votes.against
            ? "tie"
            : fight.votes.for > fight.votes.against
              ? "aggressor"
              : "defender";

        if (result === "tie") {
          updateUserRecord("antagonist", "record.ties");
          updateUserRecord("defender", "record.ties");
        } else if (result === "aggressor") {
          updateUserRecord("antagonist", "record.wins");
          updateUserRecord("defender", "record.losses");
        } else if (result === "defender") {
          updateUserRecord("antagonist", "record.losses");
          updateUserRecord("defender", "record.wins");
        }

        fight.isExpired = true;
        fight.save((err, res) => {
          if (err) {
            return res
              .status(500)
              .json(
                errorJSON(
                  "For what it's worth, an error occurred with the timer."
                )
              );
          }
        });
      })
      .catch(err => {
        console.error(err);
      });
  });
};

exports.setLive = async (req, res) => {
  let { fightId } = req.params;
  let { beef, bother, takeAction } = req.body;

  let fight = await Fight.findById(fightId).populate({
    path: "antagonist defender",
    select: "_id"
  });

  fight.text.defender.do = beef;
  fight.text.defender.bother = bother;
  fight.text.defender.action = takeAction;
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
      scheduleJob(fightId);
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
        "We can`t seem to retrieve any fights right now. Try again, I guess?"
    });
  }

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
  function notFoundJSON(message, type = "not found") {
    return {
      type,
      message
    };
  }

  await Fight.findById(fightId)
    .populate({
      path: "antagonist defender",
      select: "username avatar"
    })
    .then(fight => {
      return res.status(200).json({
        type: "success",
        fight
      });
    })
    .catch(() => {
      return res
        .status(404)
        .json(
          notFoundJSON(
            "This hatchet is either canceled, deleted, or non-existent. The choice is yours."
          )
        );
    });
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

  let active = null;

  await Fight.find({
    $or: [
      { $and: [{ antagonist: user }, { isLive: true }] },
      { $and: [{ defender: user }, { isLive: true }] }
    ]
  })
    .populate(populateOptions)
    .then(result => {
      active = result;
    })
    .catch(err => {
      console.error(err);
    });

  const waitingOnYou = await Fight.find({
    defender: userId,
    isLive: false
  }).populate(populateOptions);

  const waitingOnThem = await Fight.find({
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

exports.surrender = async (req, res) => {
  let fightId = req.params.fightId;
  const expireHatchet = async () => {
    await Fight.findOneAndUpdate(
      { _id: fightId },
      {
        $set: {
          "votes.for": 1,
          isLive: true,
          isExpired: true,
          userSurrendered: true,
          activatedAt: new Date(new Date().setDate(new Date().getDate() - 1))
        }
      }
    )
      .then(() => {
        return res.status(200).json({
          type: "success",
          message: "You did it. You gave up."
        });
      })
      .catch(err => {
        return res.status(500).json({
          type: "failure",
          error: err
        });
      });
  };
  await FightExpire.findOneAndRemove(fightId)
    .then(() => {
      expireHatchet();
    })
    .catch(err => {
      return res.status(500).json({
        type: "failure",
        error: err
      });
    });
};

exports.cancelFight = async (req, res) => {
  let fightId = req.params.fightId;
  let user = await User.findById(req.params.userId);

  // Remove the fight from DB
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

  let opponentRef = req.body.opponent;
  let findBy = validator.validate(opponentRef)
    ? { email: opponentRef }
    : { username: opponentRef };

  opponent = await User.findOne(findBy);

  if (!opponent || opponent === null) {
    // Case: User not found via email lookup. Send an invite
    if (validator.validate(opponentRef)) {
      console.log(`We just sent a site invitation to ${opponentRef}...`);
      // res.status(400).json({
      //   type: 'failure',
      //   message: `We just sent a site invitation to ${opponentRef}...`
      // });
      res.redirect("back");
    } else {
      // Case: User not found via username lookup. Give up
      console.log(`Sorry, we have no record of ${opponentRef}`);
      // res.status(400).json({
      //   type: 'failure',
      //   message: `Sorry, we have no record of ${opponentRef}`
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
  }).populate({
    path: "antagonist defender",
    select: "username avatar"
  });
};
