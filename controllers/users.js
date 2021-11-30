const User = require('../models/user');
module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};
module.exports.registerUser = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		console.log(registeredUser);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
		});
		req.flash('success', 'Welcome to YelpCamp');
		res.redirect('/campgrounds');
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};
module.exports.logout = (req, res) => {
	req.logOut(); //logout is a function from passport
	req.flash('success', 'Logged out, see you soon');
	res.redirect('/campgrounds');
};
module.exports.login = (req, res) => {
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	req.flash('success', 'Welcome Back');
	res.redirect(redirectUrl);
};
