// Schema và Model cho văn bản
const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    documentBook: {
        type: String,
        required: true,
        trim: true
    },
    documentNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    sendingUnit: {
        type: String,
        required: true
    },
    recivingUnit: {
        type: String,
        required: true
    },
    recivedDate: {
        type: Date,
        required: true
    },
    recordedDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    receivingMethod: {
        type: String,
        enum: ['Online', 'Offline'],
        default: 'Offline'
    },
    urgencyLevel: {
        type: String,
        enum: ['Thường', 'Khẩn', 'Hoả tốc'],
        default: 'Thường'
    },
    confidentialityLevel: {
        type: String,
        enum: ['Bình thường', 'Mật', 'Tối mật'],
        default: 'Bình thường'
    },
    documentType: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    signer: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    attachments: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Draft', 'Processing', 'Completed', 'Canceled'],
        default: 'Draft'
    },  
    // createdBy: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }
});

module.exports = mongoose.model('Document', documentSchema);