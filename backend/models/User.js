// Schema và Model cho người dùng
const mongoose = require('mongoose');
const constants = require('../constants/constants');
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
    avatar: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        enum: [constants.GENDER.MALE, constants.GENDER.FEMALE, constants.GENDER.OTHER],
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
        type: Schema.Types.ObjectId,
        ref: 'Department',
        require: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        require: true
    },
    isLocked: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);