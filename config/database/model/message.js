const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema({
    message: String,
    time: String,
    replies: [String],
    likes: Number,
    displayName: String
});

const Message = mongoose.model("Messages", messageSchema);

exports.messageSchema = messageSchema;
exports.Message = Message;
