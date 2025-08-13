const mongoose = require('mongoose');
const constants = require('../constants/constants');
const Schema = mongoose.Schema;

// --- Định nghĩa Schema con ---

const processingAssignmentSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        enum: ['mainProcessor', 'collaborator', 'inform'],
        required: true,
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'returned'],
        default: 'processing',
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
    note: {
        type: String,
    },
    deadline: {
        type: Date,
    },
});

const processingHistorySchema = new mongoose.Schema({
    action: {
        type: String,
        enum: [
            'createDocument',
            'forwardProcessing',
            'completeProcessing',
            'returnDocument',
        ],
        required: true,
    },
    actorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    details: {
        processors: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        note: {
            type: String
        },
    },
});

// --- Định nghĩa Schema chính: Document ---

const documentSchema = new Schema({
    // Trạng thái và quản lý xử lý
    status: {
        type: String,
        enum: [
            constants.DOCUMENT_STATUS.DRAFT,
            constants.DOCUMENT_STATUS.PROCESSING,
            constants.DOCUMENT_STATUS.COMPLETED,
        ],
        default: constants.DOCUMENT_STATUS.DRAFT,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    currentAssignments: [processingAssignmentSchema],
    processingHistory: [processingHistorySchema],

    // Các trường hiển thị nhanh thông tin trả lại
    lastReturnReason: {
        type: String,
        default: '',
    },
    lastReturnedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    lastReturnedAt: {
        type: Date,
        default: null,
    },
    
    // Thông tin cơ bản và phân loại của văn bản
    documentBook: {
        type: String,
        required: true,
        trim: true,
    },
    documentNumber: {
        type: String,
        trim: true,
    },
    documentType: {
        type: String,
        required: true,
        trim: true,
    },
    summary: {
        type: String,
        required: true,
        trim: true,
    },
    signer: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    attachments: [
        {
            type: String,
        }
    ],

    // Thông tin về nguồn gốc và phương thức nhận
    sendingUnit: {
        type: String,
        required: true,
    },
    recivingUnit: {
        type: String,
        required: true,
    },
    receivingMethod: {
        type: String,
        enum: [constants.RECEIVING_METHOD.ONLINE, constants.RECEIVING_METHOD.OFFLINE],
        default: constants.RECEIVING_METHOD.ONLINE,
    },

    // Cấp độ quan trọng và bảo mật
    urgencyLevel: {
        type: String,
        enum: [constants.URGENCY_LEVEL.NORMAL, constants.URGENCY_LEVEL.URGENT, constants.URGENCY_LEVEL.EMERGENCY],
        default: constants.URGENCY_LEVEL.NORMAL,
    },
    confidentialityLevel: {
        type: String,
        enum: [constants.CONFIDENTIALITY_LEVEL.NORMAL, constants.CONFIDENTIALITY_LEVEL.CONFIDENTIAL,
        constants.CONFIDENTIALITY_LEVEL.SECRET],
        default: constants.CONFIDENTIALITY_LEVEL.NORMAL,
    },

    // Thông tin ngày tháng
    recivedDate: {
        type: Date,
        required: true,
    },
    recordedDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Document', documentSchema);