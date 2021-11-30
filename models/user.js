const mongoose = require('mongoose');
const localMongo = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	}
});
userSchema.plugin(localMongo);

module.exports = mongoose.model('User', userSchema);
