// Schema và Model cho người dùng
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    phoneNumber: {
        type: String,
        require: true,
        trim: true
    },
    dayOfBirth: {
        type: Date,
        require: true
    },
    address: {
        type: String
    },
    lastLogin: {
        type: Date
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    departmentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        require: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        require: true
    },
    isLocked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);