var mongoose = require("mongoose");
    Campground = require("./models/campground");
    Comment = require("./models/comment");

data = [
    {
        "name" : "Ladakh", 
        "image" : "https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2018/04/acj-2404-camping-in-leh-5.jpg", 
        "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet elementum nulla. Vestibulum in tincidunt leo. Quisque eget tortor orci. Sed imperdiet urna ut magna pulvinar dignissim. Cras convallis tincidunt congue. Aliquam dapibus magna ac metus lobortis bibendum. Suspendisse egestas nec neque et viverra. Nunc venenatis eu eros ut semper." 
    },
    {
        "name" : "Dehradun", 
        "image" : "https://www.xperienceindia.in/camp-taapu-sera/home/img/gallery/gallery-2.jpg", 
        "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet elementum nulla. Vestibulum in tincidunt leo. Quisque eget tortor orci. Sed imperdiet urna ut magna pulvinar dignissim. Cras convallis tincidunt congue. Aliquam dapibus magna ac metus lobortis bibendum. Suspendisse egestas nec neque et viverra. Nunc venenatis eu eros ut semper." 
    },
    { 
        "name" : "Assam", 
        "image" : "https://toib.b-cdn.net/wp-content/uploads/2017/08/nameri-eco-camp-assam.jpg", 
        "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet elementum nulla. Vestibulum in tincidunt leo. Quisque eget tortor orci. Sed imperdiet urna ut magna pulvinar dignissim. Cras convallis tincidunt congue. Aliquam dapibus magna ac metus lobortis bibendum. Suspendisse egestas nec neque et viverra. Nunc venenatis eu eros ut semper." 
    },
    { 
        "name" : "Karjat", 
        "image" : "https://media-cdn.tripadvisor.com/media/photo-s/0d/ed/d4/fd/getlstd-property-photo.jpg", 
        "description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet elementum nulla. Vestibulum in tincidunt leo. Quisque eget tortor orci. Sed imperdiet urna ut magna pulvinar dignissim. Cras convallis tincidunt congue. Aliquam dapibus magna ac metus lobortis bibendum. Suspendisse egestas nec neque et viverra. Nunc venenatis eu eros ut semper." 
    },
    { 
        "name" : "Guwahati", 
        "image" : "https://r-cf.bstatic.com/images/hotel/max1024x768/237/237654664.jpg", 
        "description" : "Camping site between the hills and at the banks of a river"
    }
];

function seedDB() {
    Campground.remove({}, function (err) {
        // if(err) {
        //     console.log(err);
        // }
        // console.log("Campgrounds Removed")
        // data.forEach(seed => {
        //     Campground.create(seed, function (err, campground) {
        //         if(err) {
        //             console.log(err);
        //         } else {
        //             console.log("Added Campground");
        //             Comment.create({
        //                 text: "This is a really beautiful and flambouyant location situated at the banks of a river which makes the scenery even more beautiful.",
        //                 author: "McD"
        //             }, function(err, comment) {
        //                 if(err) {
        //                     console.log(err);
        //                 }else {
        //                     campground.comments.push(comment);
        //                     campground.save()
        //                 }
        //             });
        //         }
        //     });
        // });
    });
}

module.exports = seedDB