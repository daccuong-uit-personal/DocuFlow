// Logic nghiệp vụ cho văn bản

const mongoose = require("mongoose");
const Document = require("../models/Document");
const User = require("../models/User");
const constants = require("../constants/constants");
const { canDelegate } = require("./roleFlowService");

// Helper function để tạo một đối tượng lịch sử xử lý.
const createHistoryEntry = (action, actorId, details) => {
    return {
        action,
        actorId,
        details: {
            processors: details.processors || [],
            note: details.note || '',
        },
    };
};

// Helper function để tạo một đối tượng nhiệm vụ xử lý.
const createProcessingAssignment = (processor, assignerId, note, deadline) => {
    return {
        userId: processor.userId,
        role: processor.role,
        note: note,
        deadline: deadline,
        assignedBy: assignerId,
        status: 'processing',
    };
};

exports.getDocumentById = async (documentId) => {
    try {
        const document = await Document.findById(documentId)
            .populate({
                path: 'currentAssignments.userId',
                select: 'name role'
            })
            .populate({
                path: 'currentAssignments.assignedBy',
                select: 'name'
            })
            .populate({
                path: 'createdBy',
                select: 'name'
            })
            .populate({
                path: 'processingHistory',
                populate: [
                    {
                        path: 'actorId',
                        select: 'name'
                    },
                    {
                        path: 'details.processors.userId',
                        select: 'name'
                    }
                ]
            });
        if (!document) {
            throw new Error('Không tìm thấy văn bản.');
        }
        return document;
    } catch (error) {
        throw new Error(`Lỗi khi lấy thông tin văn bản: ${error.message}`);
    }
};

exports.updateDocument = async (documentId, updatedData) => {
    try {
        const document = await Document.findByIdAndUpdate(documentId, updatedData, { new: true });
        return document;
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
};

exports.deleteDocument = async (documentId) => {
    try {
        const document = await Document.findByIdAndDelete(documentId);
        return document;
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
};

exports.deleteManyDocuments = async (documentIds) => {
    try {
        const result = await Document.deleteMany({ _id: { $in: documentIds } });

        console.log(`${result.deletedCount} documents deleted successfully.`);

        return result;
    } catch (error) {
        console.error("Error deleting documents:", error);
        throw error;
    }
};

exports.searchAndFilterDocuments = async (queryOptions, user) => {
    try {
        const {
            searchText,
            documentBook,
            documentNumber,
            sendingUnit,
            recivingUnit,
            receivingMethod,
            urgencyLevel,
            confidentialityLevel,
            documentType,
            category,
            signer,
            status,
            recivedDateFrom,
            recivedDateTo,
            dueDateFrom,
            dueDateTo,
        } = queryOptions;

        let query = {};

        if (user && user.roleName !== 'admin') {
            query.$or = [
                { 'currentAssignments.userId': user.id },
                { 'createdBy': user.id }
            ];
        }

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            query.$or = [
                { documentBook: searchRegex },
                { documentNumber: searchRegex },
                { sendingUnit: searchRegex },
                { recivingUnit: searchRegex },
                { documentType: searchRegex },
                { category: searchRegex },
                { signer: searchRegex },
                { summary: searchRegex },
            ];
        }

        if (documentBook) {
            query.documentBook = documentBook;
        }
        if (documentNumber) {
            query.documentNumber = documentNumber;
        }
        if (sendingUnit) {
            query.sendingUnit = sendingUnit;
        }
        if (recivingUnit) {
            query.recivingUnit = recivingUnit;
        }
        if (receivingMethod) {
            query.receivingMethod = receivingMethod;
        }
        if (urgencyLevel) {
            query.urgencyLevel = urgencyLevel;
        }
        if (confidentialityLevel) {
            query.confidentialityLevel = confidentialityLevel;
        }
        if (documentType) {
            query.documentType = documentType;
        }
        if (category) {
            query.category = category;
        }
        if (signer) {
            query.signer = signer;
        }
        if (status) {
            query.status = status;
        }

        // Lọc theo khoảng ngày nhận (recivedDate)
        if (recivedDateFrom || recivedDateTo) {
            query.recivedDate = {};
            if (recivedDateFrom) {
                query.recivedDate.$gte = recivedDateFrom;
            }
            if (recivedDateTo) {
                query.recivedDate.$lte = recivedDateTo;
            }
        }

        // Lọc theo khoảng ngày đến hạn (dueDate)
        if (dueDateFrom || dueDateTo) {
            query.dueDate = {};
            if (dueDateFrom) {
                query.dueDate.$gte = dueDateFrom;
            }
            if (dueDateTo) {
                query.dueDate.$lte = dueDateTo;
            }
        }
        const documents = await Document.find(query).sort({ recivedDate: -1 });
        return documents;
    } catch (error) {
        console.error("Error searching and filtering documents:", error);
        throw error;
    }
};

// Tạo một văn bản mới với trạng thái DRAFT.
exports.createDocument = async (documentData, creatorId) => {
    const newDocument = new Document({
        ...documentData,
        createdBy: creatorId,
    });

    // Thêm bản ghi lịch sử tạo văn bản
    const historyEntry = createHistoryEntry('createDocument', creatorId, { note: 'Văn bản được khởi tạo.' });
    newDocument.processingHistory.push(historyEntry);

    await newDocument.save();
    return newDocument;
};

// Chuyển xử lý văn bản cho người khác.
exports.forwardProcessDocuments = async (documentIds, assignerId, processors, note, deadline) => {
    // 1. Tìm và kiểm tra các văn bản
    const documents = await Document.find({ _id: { $in: documentIds } });
    if (!documents || documents.length === 0) {
        throw new Error('Không tìm thấy văn bản nào.');
    }

    const updatedDocuments = [];

    // Tìm thông tin người giao việc một lần duy nhất
    const assignerUser = await User.findById(assignerId)
        .populate('role', 'name');
    if (!assignerUser) {
        throw new Error('Không tìm thấy người giao việc.');
    }

    // Tìm thông tin của tất cả người nhận việc một lần duy nhất
    const processorUserIds = processors.map(p => p.userId);
    const processorUsers = await User.find({ _id: { $in: processorUserIds } }).populate('role', 'name');
    if (processorUsers.length !== processors.length) {
        throw new Error('Một hoặc nhiều người nhận việc không tồn tại.');
    }

    for (const doc of documents) {
        // 2. Kiểm tra quyền chuyển tiếp của người giao việc
        const isAssignerCreator = doc.createdBy.equals(assignerId);
        const assignerAssignment = doc.currentAssignments.find(assignment =>
            assignment.userId.equals(assignerId) &&
            assignment.status === 'processing' &&
            ['mainProcessor', 'collaborator'].includes(assignment.role)
        );

        if (!isAssignerCreator && !assignerAssignment) {
            throw new Error(`Người dùng ${assignerId} không có quyền chuyển tiếp văn bản ${doc._id}. Chỉ người tạo, người xử lý chính hoặc người phối hợp mới có quyền này.`);
        }

        // 3. Kiểm tra vai trò của người nhận việc
        for (const p of processors) {
            const processorUser = processorUsers.find(u => u._id.equals(p.userId));
            if (!canDelegate(assignerUser.role.name, processorUser.role.name)) {
                throw new Error(`Vai trò của người giao việc (${assignerUser.role.name}) không thể chuyển tiếp cho vai trò của người nhận việc (${processorUser.role.name}).`);
            }
        }

        // 4. Kiểm tra điều kiện trùng lặp
        const existingMainProcessor = doc.currentAssignments.some(assignment => assignment.role === 'mainProcessor' && assignment.status === 'processing');
        const newMainProcessorCount = processors.filter(p => p.role === 'mainProcessor').length;

        if (newMainProcessorCount > 1) {
            throw new Error('Không thể chỉ định nhiều hơn một người xử lý chính trong một lần chuyển.');
        }

        if (existingMainProcessor && newMainProcessorCount === 1) {
            throw new Error('Không thể chỉ định người xử lý chính mới khi đã có người xử lý chính đang hoạt động.');
        }

        const newAssignments = [];

        for (const p of processors) {
            // Tìm xem người nhận mới đã có nhiệm vụ đang xử lý hay chưa
            const isAlreadyAssigned = doc.currentAssignments.some(assignment => 
                assignment.userId.equals(p.userId) && assignment.status === 'processing'
            );

            // Nếu người này chưa có nhiệm vụ nào, tạo một nhiệm vụ mới
            if (!isAlreadyAssigned) {
                newAssignments.push(createProcessingAssignment(p, assignerId, note, deadline));
            }
            // Nếu họ đã có nhiệm vụ đang xử lý, bỏ qua và không tạo thêm nhiệm vụ trùng lặp
        }

        // 5. Thêm các nhiệm vụ mới vào danh sách
        doc.currentAssignments.push(...newAssignments);

        // 6. Cập nhật trạng thái tổng thể của văn bản
        doc.status = constants.DOCUMENT_STATUS.PROCESSING;

        // 7. Ghi lại lịch sử
        const historyEntry = createHistoryEntry('forwardProcessing', assignerId, {
            processors: processors.map(p => ({
                userId: p.userId,
                role: p.role
            })),
            note
        });
        doc.processingHistory.push(historyEntry);

        // 8. Lưu lại thay đổi
        await doc.save();
        updatedDocuments.push(doc);
    }

    return updatedDocuments;
};

// Trả lại văn bản cho người đã giao trước đó.
exports.returnDocuments = async (documentIds, assigneeId, note) => {
    const documents = await Document.find({ _id: { $in: documentIds } });
    if (!documents || documents.length === 0) {
        throw new Error('Không tìm thấy văn bản nào.');
    }

    const updatedDocuments = [];
    for (const doc of documents) {
        const assignmentToReturn = doc.currentAssignments.find(
            a => a.userId.toString() === assigneeId.toString() && a.status === 'processing'
        );

        if (!assignmentToReturn) {
            throw new Error(`Bạn không có nhiệm vụ đang chờ xử lý với văn bản có ID: ${doc._id}.`);
        }

        // Cập nhật trạng thái của nhiệm vụ hiện tại thành 'returned'
        assignmentToReturn.status = 'returned';

        // Ghi lại lịch sử trả lại
        doc.processingHistory.push(createHistoryEntry(
            'returnDocument',
            assigneeId,
            { note: note }
        ));

        // Cập nhật các trường hiển thị nhanh thông tin trả lại
        doc.lastReturnReason = note || '';
        doc.lastReturnedBy = assigneeId;
        doc.lastReturnedAt = new Date();

        // Trạng thái chung của văn bản vẫn là PROCESSING để người khác xử lý
        // nếu có nhiều nhiệm vụ cùng lúc
        doc.status = constants.DOCUMENT_STATUS.PROCESSING;

        await doc.save();
        updatedDocuments.push(doc);
    }

    return updatedDocuments;
};

exports.markAsComplete = async (documentIds, processorId) => {
    const documents = await Document.find({ _id: { $in: documentIds } });
    if (!documents || documents.length === 0) {
        throw new Error('Không tìm thấy văn bản nào.');
    }

    const updatedDocuments = [];
    for (const doc of documents) {
        const currentAssignment = doc.currentAssignments.find(
            a => a.userId.toString() === processorId.toString() && a.status === 'processing'
        );

        if (!currentAssignment) {
            throw new Error(`Bạn không có nhiệm vụ đang chờ xử lý với văn bản có ID: ${doc._id}.`);
        }

        // Cập nhật trạng thái nhiệm vụ của người xử lý hiện tại
        currentAssignment.status = 'completed';

        // Ghi lại lịch sử
        doc.processingHistory.push(createHistoryEntry(
            'completeProcessing',
            processorId,
            { note: 'Nhiệm vụ đã được hoàn thành.' }
        ));

        // Nếu người xử lý chính đã hoàn thành, cập nhật trạng thái tổng thể của văn bản
        const mainProcessorAssignment = doc.currentAssignments.find(a => a.role === 'mainProcessor');
        if (mainProcessorAssignment && mainProcessorAssignment.status === 'completed') {
            doc.status = constants.DOCUMENT_STATUS.COMPLETED;
        } else {
            doc.status = constants.DOCUMENT_STATUS.PROCESSING;
        }

        await doc.save();
        updatedDocuments.push(doc);
    }

    return updatedDocuments;
};