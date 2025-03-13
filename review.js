const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res, next) => { //validateReview
    console.log("Review route hit!");  // Debugging log
    let listing = await Listing.findById(id).populate("reviews");
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`);
}