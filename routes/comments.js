const express = require("express");
      router = express.Router({mergeParams: true});
      Campground = require("../models/campground");
      Comment = require("../models/comment");
      middleware = require("../middleware");

// ****************************
// Comments Routes
// ****************************

router.post("/", middleware.isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err || !campground) {
            req.flash("error", "Could not find campground. Please try again.")
            console.log(err)
        } else {
            Comment.create(req.body.comment, (err, comment)=> {
                if(err) {
                    req.flash("error", "Could not add comment. Please try again.")
                    console.log(err)
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    req.flash("success", "Comment added successfully.")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
})

// Edit Route
router.get("/:comment_id/edit", middleware.checkCommentAuth, (req, res)=> {
    Campground.findById(req.params.id, (err, foundCampground)=> {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found.")
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, (err, foundComment)=> {
            if(err || !foundComment) {
                req.flash("error", "Could not find campground. Please try again.")
                res.redirect("back")
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
            }
        })
    })
})

router.put("/:comment_id", middleware.checkCommentAuth, (req, res)=> {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=> {
        if(err || !updatedComment) {
            req.flash("error", "Could not update campground. Please try again.")
            res.redirect("back")
        } else {
            req.flash("success", "Comment updated successfully.")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// Delete Route
router.delete("/:comment_id", middleware.checkCommentAuth, (req, res)=> {
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment)=> {
        if(err || !deletedComment) {
            req.flash("error", "Could not delete campground. Please try again.")
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted successfully.")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

module.exports = router;