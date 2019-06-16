const User = require(`../models/user`);
const { comparePassword, randomPassword } = require(`../helpers/password`);
const { generateToken } = require(`../helpers/token`);
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

class ControllerUser {
  static register(req, res, next) {
    req.body.picture =
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png";
    User.create(req.body)
      .then(created => {
        res.status(201).json(created);
      })
      .catch(next);
  }

  static login(req, res, next) {
    User.findOne({ email: req.body.email })
      .then(found => {
        if (found) {
          if (comparePassword(req.body.password, found.password) === true) {
            let token = generateToken(found._id, found.email, found.name);
            let user = {
              _id: found._id,
              email: found.email,
              name: found.name,
              picture: found.picture
            };
            res.status(200).json({ token, user });
          } else {
            next({ code: 400, message: `password / email wrong` });
          }
        } else {
          next({ code: 400, message: `password / email wrong` });
        }
      })
      .catch(next);
  }

  static logingoogle(req, res, next) {
    var newUser = {};
    client
      .verifyIdToken({
        idToken: req.headers.token,
        audience: process.env.CLIENT_ID
      })
      .then(ticket => {
        let payload = ticket.getPayload();

        newUser = {
          name: payload.given_name + " " + payload.family_name,
          email: payload.email,
          password: randomPassword(10),
          picture: payload.picture
        };
        return User.findOne({
          email: newUser.email
        });
      })
      .then(userLogin => {
        if (!userLogin) {
          return User.create(newUser);
        } else {
          return userLogin;
        }
      })
      .then(loggedIn => {
        let token = generateToken(loggedIn._id, loggedIn.email, loggedIn.name);
        let data = {
          _id: loggedIn._id,
          email: loggedIn.email,
          name: loggedIn.name,
          picture: loggedIn.picture
        };
        let obj = {
          token,
          user: data
        };
        res.status(200).json(obj);
      })
      .catch(next);
  }

  static allusersname(req, res, next) {
    User.find({})
      .then(founds => {
        let result = [];
        founds.forEach(user => {
          let { _id, name, email, picture } = user;
          result.push({ _id, name, email, picture });
        });
        res.status(200).json(result);
      })
      .catch(next);
  }
}

module.exports = ControllerUser;
