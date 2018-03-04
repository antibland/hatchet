const Fight = require('../models/fight');
const User = require('../models/user');

exports.getFights = (req, res) => {
  Fight.find({}, (err, fights) => {
    if (err) throw err;
    res.status(200).json(fights);
  })
}

exports.newFight = (req, res) => {
  let f = new Fight({
    type: req.body.type,
    antagonist: {
      username: 'admin',
      email: 'jackhammer@ee.com',
      text: req.body.beef
    }
  });

  f.save(err => {
    if (err) throw err;
    const data = {type: 'success', message: 'it worked'};

    res.redirect('back');
  });
}
