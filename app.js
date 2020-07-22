const express               = require("express")
      bodyParser            = require("body-parser")
      mongoose              = require("mongoose")
      flash                 = require("connect-flash")
      passport              = require("passport")
      LocalStrategy         = require("passport-local")
      passportLocalMongoose = require("passport-local-mongoose")
      methodOverride        = require("method-override")
      Campground            = require("./models/campground")
      Comment               = require("./models/comment")
      User                  = require("./models/user")

const app = express()

require('dotenv').config()

const campgroundRoutes = require("./routes/campgrounds")
      commentRoutes = require("./routes/comments")
      authRoutes = require("./routes/index")

// seedDB()

// mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect("mongodb+srv://Mihir:" + process.env.DB_PASS + "@cluster0.cmfi2.mongodb.net/yelp_camp?retryWrites=true&w=majority", {useNewUrlParser: true, useCreateNewIndex: true, useUnifiedTopology: true})

app.locals.moment = require("moment")

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

// Passport Config
app.use(require("express-session")({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware to get the user
app.use((req, res, next)=> {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
});

app.use(authRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(process.env.PORT, ()=> {
    console.log("Server Running...")
})