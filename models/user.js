var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  avatar: {
    path: {
      type: String,
      trim: true
    }
  },
  roles: [{ type: "String" }],
  fights: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fight"
    }
  ],
  votedOn: {
    type: Array,
    default: []
  },
  record: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    ties: { type: Number, default: 0 }
  },
  stats: {
    "overly sensitive": { type: Number, default: 0 },
    "short-tempered": { type: Number, default: 0 },
    inconsiderate: { type: Number, default: 0 },
    irrational: { type: Number, default: 0 },
    judgemental: { type: Number, default: 0 },
    selfish: { type: Number, default: 0 }
  },
  watching: [String],
  sessionToken: String
});

//authenticate input against database
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email }).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      var err = new Error("User not found.");
      err.status = 401;
      return callback(err);
    }

    bcrypt.compare(password, user.password, function(err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

//hashing a password before saving it to the database
UserSchema.pre("save", function(next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
