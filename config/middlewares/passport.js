const LocalStrategy = require("passport-local").Strategy;
const {User} = require("../database/model/user");
const bcrypt = require("bcrypt");

const setPassport = (passport)=>{
    passport.use(new LocalStrategy({usernameField: "email"},
        function(email, password, done) {
            User.findOne({email: email}, function(err, user){
                if (err) {
                    return done(err);
                } else if (!user) {
                    return done(null, false, {message: "incorrect email or password"});
                }
                // check password using bcrypt
                bcrypt.compare(password, user.password, (error, result)=>{
                    if (error){
                        return error;
                    } else if (!result) {
                        return done(null, false, {message: "incorrect email or password"});
                    } else {
                        return done(null, user);
                    }
                })
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
}

module.exports = setPassport;