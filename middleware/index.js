var Campground = require("../models/campground");
    Comment = require("../models/comment");

var middlewareObj = {}

middlewareObj.checkCampgroundAuth = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if(err || !foundCampground) {
                req.flash("error", err);
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else{
                    req.flash("error", "Permission Denied - Not Authorized");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            }
        });
    } else {
        req.flash("error", "Login Required.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentAuth = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if(err || !foundComment) {
                req.flash("error", err);
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else{
                    req.flash("error", "Permission Denied - Not Authorized");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("error", "Login Required.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Login Required");
    res.redirect("/login");

}

module.exports = middlewareObj;