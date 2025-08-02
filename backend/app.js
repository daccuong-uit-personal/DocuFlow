// 1. Import các module cần thiết
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

// Import các file cấu hình và tiện ích
const connectDB = require('./config/db');
const config = require('./config/config');
const errorHandler = require('./middlewares/errorMiddleware');

// Import các file routes
const authRoutes = require('./routes/authRoutes');
const departentsRoutes = require('./routes/departmentRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');

// 2. Khởi tạo ứng dụng Express
const app = express();

// Middlewares để xử lý CORS
app.use(
    cors({
        origin: "*",
        method: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// Middlewares để phân tích JSON request body
app.use(express.json());
app.use(session({
    secret: config.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Server uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Models
require('./models/Permission');
require('./models/Roles');
require('./models/Department');
require('./models/User');
require('./models/Document');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departentsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);

// app.use(errorHandler);

module.exports = app;