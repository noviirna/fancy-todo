const mongoose = require("mongoose");
const { Schema } = mongoose;
const { hashPassword } = require("../helpers/password");

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    validate: [
      {
        validator: function(email) {
          let re = /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(email).toLowerCase());
        },
        message: "please input valid email address"
      },
      {
        validator: function(email) {
          return this.model("User")
            .findOne({
              email
            })
            .then(result => {
              if (result) {
                return false;
              } else {
                return true;
              }
            })
            .catch(err => {
              return false;
            });
        },
        message: "that email already been used"
      }
    ]
  },
  picture: String,
  password: {
    type: String,
    minlength: [8, "password must consist of 8-16 characters"],
    maxlength: [16, "password must consist of 8-16 characters"],
    required: [true, "password is required"]
  }
});

UserSchema.pre("save", function(next) {
  this.password = hashPassword(this.password);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
