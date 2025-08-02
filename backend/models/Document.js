// Schema và Model cho văn bản
const mongoose = require('mongoose');
const constants = require('../constants/constants');
const Schema = mongoose.Schema;

const processingHistorySchema = new mongoose.Schema({
    assignerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assigneeId:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ],
    action: {
        type: String,
        enum: [constants.ACTIONS.DELEGATE, constants.ACTIONS.ADD_PROCESSOR, constants.ACTIONS.MARK_AS_COMPLETE, constants.ACTIONS.RECALL, constants.ACTIONS.UPDATE_PROCESSOR],
        required: true,
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
    note: {
        type: String,
        required: false,
    },
    deadline: {
        type: Date,
        required: true,
    }
});

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
        enum: [constants.RECEIVING_METHOD.ONLINE, constants.RECEIVING_METHOD.OFFLINE],
        default: constants.RECEIVING_METHOD.ONLINE
    },
    urgencyLevel: {
        type: String,
        enum: [constants.URGENCY_LEVEL.NORMAL, constants.URGENCY_LEVEL.URGENT, constants.URGENCY_LEVEL.EMERGENCY],
        default: constants.URGENCY_LEVEL.NORMAL
    },
    confidentialityLevel: {
        type: String,
        enum: [constants.CONFIDENTIALITY_LEVEL.NORMAL, constants.CONFIDENTIALITY_LEVEL.CONFIDENTIAL, constants.CONFIDENTIALITY_LEVEL.SECRET],
        default: constants.CONFIDENTIALITY_LEVEL.NORMAL
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
        enum: [constants.DOCUMENT_STATUS.DRAFT, constants.DOCUMENT_STATUS.PROCESSING, constants.DOCUMENT_STATUS.COMPLETED, constants.DOCUMENT_STATUS.CANCELED],
        default: constants.DOCUMENT_STATUS.DRAFT
    },  
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    processingHistory: [processingHistorySchema],
});

module.exports = mongoose.model('Document', documentSchema);