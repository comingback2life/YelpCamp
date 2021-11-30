if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');
const userRoute = require('./routes/users');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const sessionOptions = {
	name: "session",
	secret: 'BetterSecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 604800000, //Date.NOW + No. of Miliseconds in the week
		maxAge: 604800000
	}
};
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
	useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {
	console.log('Database connected');
});
//express

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
//app.use(helmet());
passport.use(new passportLocal(User.authenticate())); //authentication method is coming from passport passport.<useLocalStrat>
passport.serializeUser(User.serializeUser()); //how do you store a user in the session
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});
app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/reviews', reviewsRoute);
app.use('/', userRoute);
app.get('/', (req, res) => {
	res.render('home');
});
app.get('/visual', async (req, res) => {
	const campgrounds = await campground.find({});
	res.render('campgrounds/visualiseData', { campgrounds });
});

app.all('*', (req, res, next) => {
	res.render('404');
});
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Oh No, Something Went Wrong!';
	console.log(`The error is : ${err.valuetype}`);
	res.status(statusCode).render('errors', { err });
});

app.listen(3000, () => {
	console.log('Server Started');
});
console.log(session);