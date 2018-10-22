const User = require("../models/user");
const Token = require("../models/verification");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const validator = require("email-validator");
const env = process.env.NODE_ENV || "development";

// Helper functions

const sendEmail = opts => {
  const req = opts.req;
  const res = opts.res;
  const token = opts.token;

  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
      return process.exit(1);
    }

    console.log("Credentials obtained, sending message...");

    let transporterOptions =
      env === "development"
        ? {
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
              user: account.user,
              pass: account.pass
            }
          }
        : {
            service: process.env.EMAIL_SERVICE,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          };

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(transporterOptions);

    // Message object
    let message = {
      from: process.env.EMAIL_USER || "",
      to: req.body.email,
      subject: "Account Verification ✔",
      text:
        "Hello,\n\n" +
        "Please verify your account by clicking the link: \nhttp://" +
        req.headers.host +
        "/api/confirmation/" +
        token.token +
        ".\n"
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.json({
        type: "success",
        message: "We've just emailed you a verification link. Make things real!"
      });
    });
  });
};

exports.join = async (req, res) => {
  if (req.body.username && req.body.email && req.body.password) {
    const regex = /^[a-zA-Z0-9_.-]*$/g;
    if (!regex.test(req.body.username)) {
      return res.status(401).json({
        type: "failure",
        message: "Sorry, but this username contains invalid characters."
      });
    }

    let userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    };

    let user = null;

    try {
      user = await User.create(userData);
    } catch (err) {
      return res.status(401).json({
        type: "failure",
        message: "The username or email address is not unique."
      });
    }

    // Create a verification token for this user
    await Token.create(
      {
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex")
      },
      (err, token) => {
        // Save the verification token
        token.save(saveErr => {
          if (saveErr) {
            return res.status(500).json({
              type: "failure",
              message: "Something went wrong on our end. Please try that again."
            });
          }

          // Send verification email
          sendEmail({ req, res, token, user });
        });
      }
    );
  }
};

exports.login = (req, res) => {
  User.authenticate(req.body.email, req.body.password, async (error, user) => {
    if (error || !user) {
      return res.status(401).json({
        type: "failure",
        message: "Your email or password is incorrect. It happens."
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        type: "failure",
        message:
          "Almost there. Please check your email and verify your account."
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        _id: user._id
      },
      process.env.JWT_SECRET
    );

    user.sessionToken = token;
    await user.save(err => {
      if (err) {
        return res.status(500).send({
          type: "failure",
          message: err.message
        });
      }
    });

    let avatar = user.avatar.path;

    return res.status(200).json({
      type: "success",
      token,
      user: {
        userid: user._id,
        username: user.username,
        avatar
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      return res.status(401).json({
        type: "failure",
        message: "A system error occurred. We are looking into it."
      });
    } else if (!user) {
      return res.status(401).json({
        type: "failure",
        message: `There is no account associated with ${req.body.email}.`
      });
    } else {
      // Generate password reset email and send email it
      return res.status(200).json({
        type: "success",
        message: `A link to reset your password has been sent to ${
          req.body.email
        }.`
      });
    }
  });
};

exports.logout = async (req, res) => {
  let { userId } = req.params;
  let user = await User.findById(userId);

  if (user) {
    user.sessionToken = undefined;

    await user.save(err => {
      if (err) {
        return res.status(500).json({
          type: "failure",
          message: err.message
        });
      }
    });
  }

  return res.status(200).json({
    type: "success",
    message: `${userId} logged out successfully`
  });
};

exports.confirmationPost = async (req, res) => {
  // Find a matching token
  await Token.findOne({ token: req.params.token_id }, (err, token) => {
    if (!token)
      return res.status(400).send({
        type: "not-verified",
        msg: "We were unable to find a valid token. Your token my have expired."
      });

    // If we found a token, find a matching user
    User.findOne({ _id: token._userId }, async (err, user) => {
      if (!user)
        return res
          .status(400)
          .send({ msg: "We were unable to find a user for this token." });
      if (user.isVerified)
        return res.status(400).send({
          type: "already-verified",
          msg: "This user has already been verified."
        });

      // Verify and save the user
      user.isVerified = true;
      await user.save(err => {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res.status(200).send("The account has been verified! Please log in.");
      });
    });
  });
};

exports.resendTokenPost = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.status(400).send({
        type: "failure",
        message: "We were unable to find a user with that email."
      });
    if (user.isVerified)
      return res.status(400).send({
        type: "success",
        message: "This account has already been verified. Please log in."
      });

    // Create a verification token, save it, and send email
    var token = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex")
    });

    // Save the token
    token.save(err => {
      if (err) {
        return res.status(500).send({
          type: "failure",
          message: "Token cannot be saved",
          errorDetails: err
        });
      }
      sendEmail({ req, res, token, user });
    });
  });
};

exports.getAvatarByUserName = async (req, res) => {
  const userName = req.params.userName;

  await User.findOne({ username: userName }, (err, user) => {
    if (err) {
      return res.status(500).json({
        isValidUser: false,
        avatar: "",
        type: "failure",
        message: "Something terrible happened. Try again."
      });
    }

    if (!user) {
      return res.status(401).json({
        isValidUser: false,
        avatar: ""
      });
    }

    if (!user.avatar || !user.avatar.path) {
      return res.status(200).json({
        isValidUser: true,
        avatar: ""
      });
    } else {
      return res.status(200).json({
        isValidUser: true,
        avatar: user.avatar.path ? user.avatar.path : ""
      });
    }
  });
};

exports.getAvatar = async (req, res) => {
  const { userId } = req.params;

  await User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      return res.status(500).json({
        type: "failure",
        message:
          "We know you have an avatar but could not retrieve it. Please try again."
      });
    }

    if (!user) {
      return res.status(401).json({
        type: false,
        avatar: null
      });
    }

    if (!user.avatar || !user.avatar.path) {
      return res.status(200).json({
        type: "success",
        avatar: null
      });
    } else {
      return res.status(200).json({
        type: "success",
        avatar: user.avatar.path
      });
    }
  });
};

exports.hasUserVoted = async (req, res) => {
  const { fightId, userId } = req.params;
  let match = false;
  let voteObj;

  const user = await User.findById(userId, err => {
    if (err) {
      return res.status(500).json({
        type: "failure",
        message: "The user is invalid"
      });
    }
  });

  user.votedOn.forEach(item => {
    if (item.fightId === fightId) {
      match = true;
      voteObj = {
        fightId: item.fightId,
        side: item.side
      };
    }
  });

  res.status(200).json({
    type: "success",
    match,
    vote: voteObj
  });
};

exports.setAvatar = async (req, res) => {
  const { userId } = req.params;

  await User.findByIdAndUpdate(
    userId,
    { "avatar.path": req.body.currentAvatar },
    { new: true },
    err => {
      if (err) {
        return res.status(500).json({
          type: "failure",
          message:
            "The bad news is your avatar didn't update. The good news is… um…"
        });
      }

      res.status(200).json({
        type: "success",
        message: "Woo-hoo! Nice new look."
      });
    }
  );
};

exports.getUser = async (req, res) => {
  await User.findOne({ username: req.params.userId }).exec((err, user) => {
    if (err) {
      res.status(401).json({
        type: "failure"
      });
    } else if (!user) {
      res.status(401).json({
        type: false
      });
    } else {
      res.status(200).json({
        type: true,
        user
      });
    }
  });
};

exports.getUserRecord = async (req, res) => {
  let { userId } = req.params;

  await User.findById(userId)
    .then(user => {
      if (user) {
        return res.status(200).json({
          message: "success",
          record: user.record
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        type: "failure",
        message: "Could not retrieve user record",
        error: err
      });
    });
};

exports.isUser = async (req, res) => {
  let ref = req.params.userReference;

  let findBy = validator.validate(ref) ? { email: ref } : { username: ref };

  let user = await User.findOne(findBy);

  let username = user !== null ? user.username : null;

  res.status(200).json({
    isUser: user !== null,
    username
  });
};

exports.isUserWatchingFight = async (req, res) => {
  let fightId = req.params.fightId;
  let user = await User.findById(req.params.userId);

  return res.status(200).json({
    isWatching: user.watching.includes(fightId)
  });
};

exports.setWatch = async (req, res) => {
  let fightId = req.params.fightId;
  let user = await User.findById(req.params.userId);
  let watches = user.watching;
  let isWatching = false;

  if (watches.includes(fightId)) {
    // remove it from array
    user.watching.splice(watches.indexOf(fightId), 1);
  } else {
    // add it to array
    user.watching.push(fightId);
    isWatching = true;
  }

  user.save(err => {
    if (err) {
      return res.status(500).json({
        type: "failure",
        message: "Update failed. And it's our fault. Sorry about that."
      });
    } else {
      return res.status(200).json({
        isWatching
      });
    }
  });
};
