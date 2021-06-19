const router = require("express").Router();
const bcrypt = require("bcrypt");
const {User} = require("../config/database/model/user");
const {check, validationResult} = require("express-validator");
const passport = require("passport");

const bioDefault = "Hello, I am a mysterious individual and I am glad to be here!!";


router.get("/signup", (req, res)=>{
    res.render("login");
})


router.post("/api", async(req, res)=>{
    const user = await User.findOne({email: req.body.email});
    res.json(user);
});

router.post("/signup",[
        check("email").isEmail(),
        check("password").isLength({min: 6})
    ],
    async(req, res)=>{
        const errors = validationResult(req);
        const {fullName, displayName, email, password} = req.body;
        if (!errors.errors) {
            res.json({error: errors.errors});
        }
        await User.create({
            fullName: fullName,
            displayName: displayName,
            email: email,
            password: await bcrypt.hash(password, 15),
            bio: bioDefault
        });
        res.json({success: "Account has been created!"});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/home/general",
    failureRedirect: "/",
    failureFlash: true
}));

router.get("/logout", (req, res)=>{
    req.logout();
    res.redirect("/");
})

// Needs to send a failure message 

module.exports = router;