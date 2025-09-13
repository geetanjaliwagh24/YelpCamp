const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, " connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0 ; i < 300 ; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '68bf455c0eff20588e2b2f33',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam similique quibusdam quis inventore obcaecati unde delectus reprehenderit iure non?',
            price,
            geometry: {
                type: "Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:  [
                {
                    url: 'https://res.cloudinary.com/drqwcdt7v/image/upload/v1757679561/YelpCamp/em2xp2udwgdg9sfhslsv.jpg',
                    filename: 'YelpCamp/em2xp2udwgdg9sfhslsv'
                },
                {
                    url: 'https://res.cloudinary.com/drqwcdt7v/image/upload/v1757678923/YelpCamp/prb8fahtxb3ddyqgmmaa.jpg',
                    filename: 'YelpCamp/prb8fahtxb3ddyqgmmaa'
                }
            ]

        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})