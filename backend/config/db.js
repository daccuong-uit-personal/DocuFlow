const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
};

module.exports = connectDB;