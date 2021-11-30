const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({
	accessToken: mapBoxToken
});
const { cloudinary } = require('../cloudinary');
module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('campgrounds/index', { campgrounds });
};
module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
};
module.exports.createCampground = async (req, res) => {
	//if (!req.body.campground) throw new ExpressError("Invalid Campground Data",400);
	const geoData = await geoCoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1
		})
		.send();
	const campgrounds = new Campground(req.body.campground);
	campgrounds.geometry = geoData.body.features[0].geometry;
	campgrounds.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
	campgrounds.author = req.user._id;
	await campgrounds.save();
	req.flash('success', 'Successfully made a new campground');
	res.redirect(`campgrounds/${campgrounds._id}`);
};
module.exports.showCampground = async (req, res) => {
	const campgrounds = await Campground.findById(req.params.id)
		.populate({
			//populate reviews first then populate the author on the review
			path: 'reviews',
			populate: {
				path: 'author'
			}
		})
		.populate('author');

	if (!campgrounds) {
		req.flash('error', 'The campground you are looking for cannot be found!');
		res.redirect('/campgrounds');
	}
	res.render('campgrounds/show', { campgrounds });
};
module.exports.renderEditForm = async (req, res) => {
	const campgrounds = await Campground.findById(req.params.id);
	if (!campgrounds) {
		req.flash('error', 'The campground you are looking for cannot be found!');
		res.redirect('/campgrounds');
	}
	if (!campgrounds.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that');
		return res.redirect(`/campgrounds/${req.params.id}`);
	}
	res.render('campgrounds/edit', { campgrounds });
};
module.exports.updateCampground = async (req, res) => {
	const { id } = req.params;
	const geoData = await geoCoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1
		})
		.send();
	const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
	campground.geometry = geoData.body.features[0].geometry;
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	campground.images.push(...imgs);
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
	}
	await campground.save();
	console.log(campground.images);
	req.flash('success', 'Successfully updated Campground');
	res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash('success', 'Successfully Deleted Campground');
	res.redirect('/campgrounds');
};
