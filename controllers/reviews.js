const campground = require('../models/campground');
const Review = require('../models/review');
module.exports.createReview = async (req, res) => {
	const campgrounds = await campground.findById(req.params.id);
	const review = new Review(req.body.review); //sending the value under the key "review"
	review.author = req.user._id;
	campgrounds.reviews.push(review); //schema.propertyName.push
	await review.save();
	await campgrounds.save();
	req.flash('success', 'Review has been added');
	res.redirect(`/campgrounds/${campgrounds._id}`);
};
module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	//$pull is a mongo method that removes everything from an existing array
	//the above statement basically means to take the id from reviews
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted the review');
	res.redirect(`/campgrounds/${id}`);
};
