require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares to handle CORS
app.use(
    cors({
        origin: "*",
        method: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));

// Connect Database
connectDB();

/// Middlewares
app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);

// Server uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});