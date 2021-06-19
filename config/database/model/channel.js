const mongoose = require("mongoose");
const {messageSchema} = require("./message");


const channelSchema = new mongoose.Schema({
    channel: String,
    messages: [messageSchema]
});


const Channel = mongoose.model("Channels", channelSchema);


const channels = {
    general: true,
    help: true,
    random: true,
    jobs: true,
    resources: true
};


exports.Channel = Channel;
exports.channels = channels;