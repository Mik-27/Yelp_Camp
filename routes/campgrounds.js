const express = require("express")
      router = express.Router()
      Campground = require("../models/campground")
      Comment = require("../models/comment")
      middleware = require("../middleware")

// =====================
// Campground Routes
// =====================

router.get("/", (req, res)=> {
    Campground.find({}, (err, campgrounds)=> {
        if(err) {
            req.flash("error", "Could not load campgrounds. Try Again.")
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user, page: "campgrounds"});
        }
    })
})

router.post("/", middleware.isLoggedIn, (req, res)=> {
    let name = req.body.name;
        image = req.body.image;
        price = req.body.price;
        location = req.body.location;
        description = req.body.description;
        author = {
            id: req.user._id,
            username: req.user.username
        };
        contact = {
            contactNumber: req.body.contactNumber,
            website: req.body.website
        };
    let newCampground = {name: name, image: image, price:price, location:location, description: description, author:author, contact:contact};
    
    // Create new campground
    Campground.create(newCampground, (err, campground)=> {
        if(err) {
            req.flash("error", "Could not create Campground. Please Try Again.")
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            req.flash("success", "Campground created successfully.")
            // Redirect back to campgrounds page.
            res.redirect("/campgrounds")            
        }
    })
})

router.get("/new", middleware.isLoggedIn, (req, res)=> {
    res.render("campgrounds/new", {page: "newCampground"})
});

router.get("/:id", (req, res)=> {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=> {
        if(err || !foundCampground) {
            req.flash("error", "Cannot find campground.")
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

// Edit Route
router.get("/:id/edit", middleware.checkCampgroundAuth, (req, res)=> {
    Campground.findById(req.params.id, (err, foundCampground)=> {
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})

// Update Route
router.put("/:id", middleware.checkCampgroundAuth, (req, res)=> {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=> {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/campgrounds")
        } else {
            req.flash("success", "Campground updated successfully.")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// Delete Route
router.delete("/:id", middleware.checkCampgroundAuth, (req, res)=> {
    Campground.findByIdAndRemove(req.params.id, (err, deletedCampground)=> {
        if(err || !foundCampground) {
            req.flash("error", "Could not delete campground. Please try again.")
            res.redirect("/campgrounds/" + req.params.id)
        } else {
            req.flash("success", "Campground deleted successfully.")
            res.redirect("/campgrounds")
        }
    })
})

module.exports= router;