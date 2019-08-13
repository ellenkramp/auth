const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  // see if a user with given email exists
  // if user exists, return error
  // if user new, create and save user record
  // respond to request with success indication
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide both email and password" });
  }
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return err(next);
    }
    console.log("no error");
    if (existingUser) {
      return res.status(422).send({ error: "Email in use" });
    }

    const user = new User({
      email: email,
      password: password
    });

    console.log(user);
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      res.json({ token: tokenForUser(user) });
    });
  });
};
