// Logic nghiệp vụ cho văn bản

const mongoose = require("mongoose");
const Document = require("../models/Document");
const User = require("../models/User");
const constants = require("../constants/constants");
const { canDelegate } = require("./roleFlowService");

// Hàm helper để tạo một entry lịch sử xử lý
const createHistoryEntry = (action, actorId, details = {}) => ({
    action: action,
    actorId: actorId,
    details: details,
});

exports.createDocument = async (documentData, userId) => {
    try {
        const newAssignment = {
            userId: userId,
            role: 'read',
            status: 'pending',
            assignedBy: userId,
            note: 'Người tạo văn bản',
            deadline: null
        };

        const document = new Document({
            ...documentData,
            status: 'Draft',
            createdBy: userId,
            assignedTo: [newAssignment]
        });

        await document.save();
        console.log("Document saved successfully:", document);
        return document;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
};

exports.getDocumentById = async (documentId) => {
    try {
        const document = await Document.findById(documentId)
            .populate({
                path: 'assignedTo.userId',
                select: 'name role'
            })
            .populate({
                path: 'assignedTo.assignedBy',
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

exports.searchAndFilterDocuments = async (queryOptions, userId) => {
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

        if (userId) {
            query['assignedTo.userId'] = userId;
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

        const documents = await Document.find(query);
        return documents;
    } catch (error) {
        console.error("Error searching and filtering documents:", error);
        throw error;
    }
};

// Hàm này có thể được sử dụng lại bởi các service khác
const updateOrCreateAssignments = (currentAssignments, newProcessors, assignerId, note, deadline) => {
    const newAssignmentsMap = new Map(newProcessors.map(p => [p.userId.toString(), p]));
    const updatedAssignments = [];

    // Lọc ra các assignment không có trong danh sách mới
    const existingAssignments = currentAssignments.filter(assignment => {
        const assignmentUserId = assignment.userId.toString();
        // Nếu user này có trong danh sách mới, ta sẽ cập nhật hoặc thay thế
        return !newAssignmentsMap.has(assignmentUserId);
    });

    // Thêm các assignment hiện có vào danh sách cập nhật
    updatedAssignments.push(...existingAssignments);

    // Thêm hoặc cập nhật các assignment mới từ danh sách đầu vào
    newProcessors.forEach(processor => {
        const assignment = {
            userId: processor.userId,
            role: processor.role,
            note: note,
            deadline: deadline,
            assignedBy: assignerId,
            status: 'pending'
        };
        updatedAssignments.push(assignment);
    });

    return updatedAssignments;
};

exports.processDocuments = async (documentIds, assignerId, processors, note, deadline) => {
    const documents = await Document.find({ _id: { $in: documentIds } });
    if (!documents || documents.length === 0) {
        throw new Error('Không tìm thấy văn bản nào.');
    }

    const updatedDocuments = [];

    for (const doc of documents) {
        // Kiểm tra quyền xử lý
        const currentAssignment = doc.assignedTo.find(
            a => a.userId.toString() === assignerId.toString() && a.status === 'pending'
        );
        if (!currentAssignment && doc.createdBy.toString() !== assignerId.toString()) {
            throw new Error(`Bạn không có quyền xử lý văn bản có ID: ${doc._id}.`);
        }

        // Cập nhật danh sách assignedTo
        doc.assignedTo = updateOrCreateAssignments(doc.assignedTo, processors, assignerId, note, deadline);

        // Cập nhật trạng thái của người ủy quyền (nếu có)
        const isDelegateAction = processors.some(p => p.role === 'read');
        if (isDelegateAction && currentAssignment) {
            currentAssignment.status = 'completed';
        }

        // Ghi lại lịch sử
        const historyAction = isDelegateAction ? constants.ACTIONS.DELEGATE : constants.ACTIONS.ADD_PROCESSOR;
        const historyEntry = createHistoryEntry(historyAction, assignerId, { processors, note });
        doc.processingHistory.push(historyEntry);

        // Cập nhật trạng thái tổng thể của văn bản
        doc.status = constants.DOCUMENT_STATUS.PROCESSING;

        await doc.save();
        updatedDocuments.push(doc);
    }

    return updatedDocuments;
};

// exports.processDocuments = async (documentIds, assignerId, processors, note, deadline) => {
//     const documents = await Document.find({ _id: { $in: documentIds } });
//     if (!documents || documents.length === 0) {
//         throw new Error('Không tìm thấy văn bản nào.');
//     }

//     const updatedDocuments = [];

//     for (const doc of documents) {
//         const currentAssignment = doc.assignedTo.find(
//             a => a.userId.toString() === assignerId.toString() && a.status === 'pending'
//         );

//         if (!currentAssignment && doc.createdBy.toString() !== assignerId.toString()) {
//             throw new Error(`Bạn không có quyền xử lý văn bản có ID: ${doc._id}.`);
//         }

//         const newAssignments = processors.map(processor => ({
//             userId: processor.userId,
//             role: processor.role,
//             note: note,
//             deadline: deadline,
//             assignedBy: assignerId,
//             status: 'pending'
//         }));

//         // Thêm người xử lý mới
//         doc.assignedTo.push(...newAssignments);

//         // Đánh dấu nhiệm vụ hiện tại đã hoàn thành nếu đây là hành động DELEGATE
//         const isDelegateAction = processors.some(p => p.role === 'read');
//         if (isDelegateAction && currentAssignment) {
//             currentAssignment.status = 'completed';
//         }

//         // Ghi lại lịch sử
//         doc.processingHistory.push(createHistoryEntry(
//             isDelegateAction ? constants.ACTIONS.DELEGATE : constants.ACTIONS.ADD_PROCESSOR,
//             assignerId,
//             { processors: newAssignments, note: note }
//         ));

//         // Cập nhật trạng thái tổng thể của văn bản
//         doc.status = constants.DOCUMENT_STATUS.PROCESSING;

//         await doc.save();
//         updatedDocuments.push(doc);
//     }

//     return updatedDocuments;
// };

exports.updateProcessors = async (documentIds, assignerId, updates) => {
    const note = updates.note || "Cập nhật người xử lý.";
    const deadline = updates.deadline || null;

    return await exports.processDocuments(documentIds, assignerId, updates.processors, note, deadline);
};

// Hàm service để trả lại văn bản
exports.returnDocuments = async (documentIds, assigneeId, note) => {
    const documents = await Document.find({ _id: { $in: documentIds } });
    if (!documents || documents.length === 0) {
        throw new Error('Không tìm thấy văn bản nào.');
    }

    const updatedDocuments = [];
    for (const doc of documents) {
        // Tìm nhiệm vụ của người đang thực hiện hành động trả lại
        const assignmentToReturn = doc.assignedTo.find(
            a => a.userId.toString() === assigneeId.toString() && a.status === 'pending'
        );

        if (!assignmentToReturn) {
            throw new Error(`Bạn không có nhiệm vụ đang chờ xử lý với văn bản có ID: ${doc._id}.`);
        }

        // Lấy ID của người đã giao việc TRƯỚC KHI xóa
        const previousAssignerId = assignmentToReturn.assignedBy;

        // Lọc và xóa assignment của người trả lại khỏi mảng
        // Tạo một mảng assignedTo mới không chứa assignment của người vừa trả lại
        doc.assignedTo = doc.assignedTo.filter(
            a => a._id.toString() !== assignmentToReturn._id.toString()
        );

        // Ghi lại lịch sử (hành động này vẫn giữ nguyên)
        doc.processingHistory.push(createHistoryEntry(
            constants.ACTIONS.RETURN,
            assigneeId,
            { note: note }
        ));

        // Gán lại nhiệm vụ cho người đã giao trước đó với trạng thái 'rejected'
        if (previousAssignerId) {
            doc.assignedTo.push({
                userId: previousAssignerId,
                role: 'read', // hoặc vai trò gốc của người đó
                status: 'rejected', // Trạng thái 'bị trả lại'
                assignedBy: assigneeId,
                note: note || 'Văn bản bị trả lại',
                deadline: null
            });
        }

        // Cập nhật các thông tin khác của văn bản
        doc.lastReturnReason = note || '';
        doc.lastReturnedBy = assigneeId;
        doc.lastReturnedAt = new Date();
        doc.status = constants.DOCUMENT_STATUS.REJECTED;

        await doc.save();
        updatedDocuments.push(doc);
    }

    return updatedDocuments;
};

// Hàm service để đánh dấu văn bản đã hoàn thành
exports.markAsComplete = async (documentIds, processorId) => {
    const documents = await Document.find({ _id: { $in: documentIds } });
    if (!documents || documents.length === 0) {
        throw new Error('Không tìm thấy văn bản nào.');
    }

    const updatedDocuments = [];
    for (const doc of documents) {
        const currentAssignment = doc.assignedTo.find(
            a => a.userId.toString() === processorId.toString() && a.status === 'pending'
        );
        if (!currentAssignment) {
            throw new Error(`Bạn không có nhiệm vụ đang chờ xử lý với văn bản có ID: ${doc._id}.`);
        }

        currentAssignment.status = 'completed';

        // Ghi lại lịch sử
        doc.processingHistory.push(createHistoryEntry(
            constants.ACTIONS.MARK_COMPLETE,
            processorId,
            { note: 'Văn bản đã được xử lý xong.' }
        ));

        // Nếu tất cả các nhiệm vụ chính (role 'read') đã hoàn thành, cập nhật trạng thái chung
        const allMainTasksCompleted = doc.assignedTo
            .filter(a => a.role === 'read')
            .every(a => a.status === 'completed');

        if (allMainTasksCompleted) {
            doc.status = constants.DOCUMENT_STATUS.COMPLETED;
        } else {
            doc.status = constants.DOCUMENT_STATUS.PROCESSING;
        }

        await doc.save();
        updatedDocuments.push(doc);
    }

    return updatedDocuments;
};

// Hàm service để thu hồi văn bản
exports.recallDocuments = async (documentIds, requesterId) => {
    const documents = await Document.find({ _id: { $in: documentIds } });
    if (!documents || documents.length === 0) {
        throw new Error('Không tìm thấy văn bản nào.');
    }

    const updatedDocuments = [];
    for (const doc of documents) {
        const lastAssignment = doc.assignedTo.findLast(
            a => a.assignedBy.toString() === requesterId.toString() && a.status === 'pending'
        );

        if (!lastAssignment) {
            throw new Error(`Không có nhiệm vụ nào của bạn đang chờ xử lý để thu hồi trong văn bản có ID: ${doc._id}.`);
        }

        // Đánh dấu nhiệm vụ hiện tại là bị từ chối
        lastAssignment.status = 'rejected';

        // Ghi lại lịch sử
        doc.processingHistory.push(createHistoryEntry(
            constants.ACTIONS.RECALL,
            requesterId,
            { assigneeId: lastAssignment.userId }
        ));

        doc.status = constants.DOCUMENT_STATUS.RECALLED;
        await doc.save();
        updatedDocuments.push(doc);
    }

    return updatedDocuments;
};