const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      minlength: 3,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [/.+@.+\..+/, "Please enter a valid email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
