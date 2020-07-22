const path = require('path');
const {
  RoomieGroup,
  MarriageGroup,
  Admin,
} = require('../db/models/stable-match-models');

const authController = {};

authController.verifyAdmin = (req, res, next) => {
  const { username, password } = req.body;
  Admin.findOne({ username }, (err, user) => {
    if (err) return next({ log: 'invalid username' });
    if (user === null) {
      res.locals.validCreds = false;
      return next();
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) return next({ log: 'compare password error' });
      if (isMatch) res.locals.validCreds = true;
      else res.locals.validCreds = false;
      return next();
    });
  });
};

module.exports = authController;
