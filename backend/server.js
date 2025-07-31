// Khỏi động server và kết nối database

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/config');

// Connect Database
connectDB();

// Start Server
const PORT = config.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});