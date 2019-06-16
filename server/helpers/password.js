const bcrypt = require("bcryptjs");

module.exports = {
  hashPassword: function(str) {
    let salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    return bcrypt.hashSync(str, salt);
  },
  comparePassword: function(pass, hash) {
    return bcrypt.compareSync(pass, hash);
  },
  randomPassword: function(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
};