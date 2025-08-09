// Schema và Model cho văn bản
const mongoose = require('mongoose');
const constants = require('../constants/constants');
const Schema = mongoose.Schema;

const processingAssignmentSchema = new mongoose.Schema({
    userId: { // ID của người được giao việc
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: { // Vai trò của người được giao việc (ví dụ: 'read', 'collaborate', 'inform')
        type: String,
        enum: ['read', 'collaborate', 'inform'],
        required: true,
    },
    status: { // Trạng thái của nhiệm vụ (pending, completed, returned, rejected)
        type: String,
        enum: ['pending', 'completed', 'returned', 'rejected'],
        default: 'pending',
    },
    assignedBy: { // ID của người đã giao việc
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedAt: { // Thời điểm được giao
        type: Date,
        default: Date.now,
    },
    note: { // Ghi chú kèm theo khi giao việc
        type: String,
    },
    deadline: { // Hạn chót của nhiệm vụ
        type: Date,
    },
});

const processingHistorySchema = new mongoose.Schema({
    action: { // Hành động (ví dụ: 'assign', 'complete', 'return', 'recall')
        type: String,
        enum: [
            constants.ACTIONS.DELEGATE,
            constants.ACTIONS.ADD_PROCESSOR,
            constants.ACTIONS.MARK_COMPLETE,
            constants.ACTIONS.RECALL,
            constants.ACTIONS.RETURN,
        ],
        required: true,
    },
    actorId: { // ID của người thực hiện hành động
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    details: { // Chi tiết hành động (ví dụ: danh sách người được giao, lý do trả lại)
        processors: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
    },
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
        enum: [constants.CONFIDENTIALITY_LEVEL.NORMAL, constants.CONFIDENTIALITY_LEVEL.CONFIDENTIAL, 
            constants.CONFIDENTIALITY_LEVEL.SECRET],
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
    attachments: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        enum: [
            constants.DOCUMENT_STATUS.DRAFT,
            constants.DOCUMENT_STATUS.PENDING_APPROVAL,
            constants.DOCUMENT_STATUS.PROCESSING,
            constants.DOCUMENT_STATUS.COMPLETED,
            constants.DOCUMENT_STATUS.REJECTED,
            constants.DOCUMENT_STATUS.CANCELED,
            constants.DOCUMENT_STATUS.RETURNED,
            constants.DOCUMENT_STATUS.RECALLED,
        ],
        default: constants.DOCUMENT_STATUS.DRAFT,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: [processingAssignmentSchema],
    processingHistory: [processingHistorySchema],
});

module.exports = mongoose.model('Document', documentSchema);