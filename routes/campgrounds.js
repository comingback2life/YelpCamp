const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateCampground, isAuthor, isLoggedIn } = require('../middleware.js');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const campgrounds = require('../controllers/campgrounds');
router
	.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
//upload.array is a middleware from multer
router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router
	.route('/:id')
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn, validateCampground, upload.array('image'), catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, catchAsync(campgrounds.deleteCampground));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
module.exports = router;
