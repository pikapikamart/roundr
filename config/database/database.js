const mongoose = require("mongoose");

const setDatabase = ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}


module.exports = setDatabase;