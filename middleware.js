const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must sign in to continue');
		res.redirect('/login');
	} else {
		next();
	}
};
module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campgrounds = await campground.findById(id);
	if (!campgrounds.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/campgrounds/${id}`);
	} else {
		next();
	}
};
module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const reviews = await Review.findById(reviewId);
	if (!reviews.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/campgrounds/${id}`);
	} else {
		next();
	}
};
module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
