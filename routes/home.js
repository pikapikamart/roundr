const router = require("express").Router();
const {Channel, channels} = require("../config/database/model/channel");

router.get("/:channel", (req, res)=>{
    const channel = req.params.channel;
    if (channels[channel]) {
        if (req.isAuthenticated()) {
            Channel.findOne({channel: channel}, async(error, result)=>{
                if (error) {
                    throw error;
                } else if(!result){
                    await Channel.create({
                        channel: channel,
                        messages: []
                    });
                    res.redirect("/home/" + channel);
                } else {
                    res.render("home", 
                        {
                            userData: req.user,
                            channel: channel,
                            messageData: result.messages
                        }
                    );
                }
            })
        } else{
            res.redirect("/");
        }
    }
    else {
        res.send("This will be 404");
    }
});


module.exports = router;