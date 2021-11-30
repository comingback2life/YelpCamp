const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
	useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {
	console.log('Database connected');
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 200; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: '614861a2f6392f0b2b9e4258',
			location: `${cities[random1000].city} , ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url:
						'https://res.cloudinary.com/dkqdk1yfw/image/upload/v1632362585/Yelpcamp/atzbmqza8nsggvimjrd7.jpg',
					filename: 'Yelpcamp/atzbmqza8nsggvimjrd7'
				},
				{
					url:
						'https://res.cloudinary.com/dkqdk1yfw/image/upload/v1632362585/Yelpcamp/lmfwbgyq0tyhbvh0iuxb.jpg',
					filename: 'Yelpcamp/lmfwbgyq0tyhbvh0iuxb'
				},
				{
					url:
						'https://res.cloudinary.com/dkqdk1yfw/image/upload/v1632362585/Yelpcamp/vw7uxxwubb0mjmmnasgs.jpg',
					filename: 'Yelpcamp/vw7uxxwubb0mjmmnasgs'
				}
			],
			description:
				'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque doloribus culpa quasi facilis ratione qui itaque placeat! A mollitia assumenda laborum ex. Cum accusamus sunt rem voluptas praesentium, ea nulla.',
			price: price,
			geometry: {
				type: 'Point',
				coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]
			}
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
