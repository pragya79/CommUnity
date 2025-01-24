const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  avatar: { type: String, required: true },
  description:{type:String}
});

const User = mongoose.model("users", userSchema);

module.exports = User;
