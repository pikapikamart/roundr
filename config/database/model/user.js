const mongoose = require("mongoose");
const {messageSchema} = require("./message");
// import message model

const userSchema = new mongoose.Schema({
    fullName: String,
    displayName: String,
    email: String,
    password: String,
    history: [messageSchema],
    bio: String
});

const User = mongoose.model("Users", userSchema);

exports.User = User;