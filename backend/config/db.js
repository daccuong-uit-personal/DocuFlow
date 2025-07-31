const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {});
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
};

module.exports = connectDB;