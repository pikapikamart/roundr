const axios = require('axios');
const {io} = require("../app");
const {User} = require("./database/model/user");
const {Channel} = require("./database/model/channel");
const {Message} = require("./database/model/message");
const {userJoin, findRoom} = require("./utilities/room");

module.exports = ()=>{

    io.on("connection", socket=>{

        socket.on("joinChannel", room=>{
            socket.join(room);
            userJoin(socket.id, room);
        })

        socket.on("message", async (result)=>{
            const timeData = await axios.get("http://worldtimeapi.org/api/timezone/Asia/Manila");
            const time = Intl.DateTimeFormat('en', { hour: "numeric", minute: "numeric", hour12: true }).format(new Date(timeData.data.datetime))
            const {message, channel, email} = result;
            let newMessage;


            await User.findOne({email:email}, (err, result)=>{
                if (err) {
                    throw err;
                } else if(result) {
                    newMessage = {
                        message: message,
                        time: time,
                        likes: 0,
                        displayName: result.displayName
                    };
                    result.history.push(new Message(newMessage));
                    result.save();
                }
            });

            await Channel.findOne({channel: channel}, (err, result)=>{
                if (err) {
                    throw err;
                }else if (result) {
                    result.messages.push(new Message(newMessage));
                    result.save();
                } 
                const room = findRoom(socket.id).channel;

                io.to(room).emit("output", newMessage);
            })
        });
    });
}