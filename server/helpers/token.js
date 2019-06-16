const jwt = require("jsonwebtoken");

module.exports = {
  generateToken: function(_id, email, name) {
    return jwt.sign({ _id, email, name }, process.env.SECRET_JWT);
  },
  decodeToken: function(token) {
    return jwt.verify(token, process.env.SECRET_JWT);
  }
};
