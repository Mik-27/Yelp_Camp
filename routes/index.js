const express = require("express");
const { nextTick } = require("process");
      router = express.Router();
      passport = require("passport");
      User = require("../models/user");
      Campground = require("../models/campground")
      async = require("async")
      nodemailer = require("nodemailer")
      crypto = require("crypto")

router.get("/", (req, res) =>{
    res.render("landing");
});

// ===============
// Auth Routes
// ===============

router.get("/register",  (req, res)=> {
    res.render("register", {page: "register"});
});

router.post("/register",  (req, res)=> {
    let newUser = new User({firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            username: req.body.username,
                            avatar: req.body.avatar,
                            email: req.body.email
                            })
    User.register(newUser, req.body.password,  (err, user)=> {
        if(err) {
            req.flash("error", err.message);
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res,  ()=> {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login",  (req, res)=> {
    res.render("login", {page: "login"});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),  (req, res)=> {
});

router.get("/logout",  (req, res)=> {
    req.logout();
    req.flash("success", "Logged Out");
    res.redirect("/campgrounds");
});

router.get("/users/:id", (req, res)=> {
    User.findById(req.params.id, (err, foundUser)=> {
        if(err) {
            req.flash("error", "Could not find user")
            res.redirect("/campgrounds")
        }
        Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds)=> {
            if(err) {
                req.flash("error", "Could not load user")
                res.redirect("/campgrounds")
            }
            res.render("users/show", {user: foundUser, campgrounds})
        })
    })
})

// ==================
// Forgot Password
// ==================

router.get("/forgot", (req, res)=> {
    res.render("forgot")
})

router.post("/forgot", (req, res)=> {
    async.waterfall([
        done => {
            crypto.randomBytes(20, (err, buf)=> {
                let token = buf.toString('hex')
                done(err, token)
            })
        },
        (token, done)=> {
            User.findOne({ email: req.body.email }, (err, user)=> {
                if(!user) {
                    req.flash("error", "No account with that email exists.")
                    return res.redirect("/forgot")
                }

                user.resetPasswordToken = token
                user.resetPasswordExpires = Date.now() + 900000         //Expires after 15 minutes

                user.save(err=> {
                    done(err, token, user)
                })
            })
        },
        (token, user, done)=> {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.GMAIL_ADDR,
                    pass: process.env.GMAIL_PW,
                }
            })
            let mailOptions = {
                to: user.email,
                from: process.env.GMAIL_ADDR,
                subject: "YelpCamp Password Reset",
                text: "You are recieving this in reference to the request that was made on "+
                    "YelpCamp" + " for resetting the password for your YelpCamp Account."
                    + "\n\n" + 
                    "Please click on the following link or paste it in your browser to complete the process:" +
                    "http://" + req.headers.host + "/reset/" + token +
                    "\n" + "This link will no longer be available after 15 minutes." +
                    "\n\n" +
                    "Please ignore if you have not made this request, your password will remail unchanged"
            }
            smtpTransport.sendMail(mailOptions, err=> {
                console.log('Mail Sent')
                req.flash("success", "An email has been sent to " + user.email + " with further instructions")
                done("err", done)
            })
        }
    ], err=> {
        if(err) return next(err)
        res.redirect('/forgot')
    })
})

router.get('/reset/:token', (req, res)=> {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()} }, (err, user)=> {
        if(!user) {
            req.flash("error", "Password reset token is invalid or has expired")
            return res.redirect("/forgot")
        }
        res.render('reset', {token: req.params.token})
    })
})

router.post('/reset/:token', (req, res)=> {
    async.waterfall([
        done=> {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt : Date.now()} }, (err, user)=> {
                if(!user) {
                    req.flash("error", "Password token is invalid or expired.")
                    return res.redirect('back')
                }
                if(req.body.password == req.body.confirm) {
                    user.setPassword(req.body.password, err=> {
                        user.resetPasswordToken == undefined
                        user.resetPasswordExpires == undefined

                        user.save(err=> {
                            req.logIn(user, err=> {
                                done(err, user)
                            })
                        })
                    })
                } else {
                    req.flash("error", "Passwords do not match.")
                    return res.redirect('back')
                }
            })
        },
        (user, done)=> {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'yelpcamp277@gmail.com',
                    pass: 'yelpcamp@2000'
                }
            })
            let mailOptions = {
                to: user.email,
                from: 'yelpcamp277@gmail.com',
                subject: "YelpCamp Password Changed",
                text: "Hello," + "\n\n" + 
                "This is just a confirmation that the password for your account " + user.username + " on YelpCamp has been updated."
            }
            smtpTransport.sendMail(mailOptions, err=> {
                req.flash("success", "Success! Your password has benn changed.")
                done("err")
            })
        }
    ], err=> {
        res.redirect('/campgrounds')
    })
})

export default router;