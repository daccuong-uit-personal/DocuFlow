// Logic nghiệp vụ cho văn bản

const mongoose = require("mongoose");
const Document = require("../models/Document");
const User = require("../models/User");
const constants = require("../constants/constants");
const { canDelegate } = require("./roleFlowService");

exports.createDocument = async (documentData, userId) => {
    try {
        const document = new Document({
            ...documentData,
            status: 'Draft',
            createdBy: userId // Sửa 'createBy' thành 'createdBy' cho khớp với Schema
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
        const document = await Document.findById(documentId);
        return document;
    } catch (error) {
        console.error("Error fetching document by ID:", error);
        throw error;
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

exports.searchAndFilterDocuments = async (queryOptions) => {
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

exports.delegateDocument = async (documentId, assignerId, assigneeId, note, deadline, assignerRoleName, action) => {
    try {
        const document = await Document.findById(documentId);

        if (!document) {
            throw new Error('Không tìm thấy văn bản.');
        }

        if (!document.assignedUsers || !document.assignedUsers.includes(assignerId)) {
            throw new Error('Bạn không có quyền chuyển xử lý văn bản này.');
        }

        // Lấy role của assignee ra check
        const assigneeUser = await User.findById(assigneeId).populate('role');

        if (!assigneeUser) {
            throw new Error('Không tìm thấy thông tin người dùng.');
        }

        const assigneeRoleName = assigneeUser.role.name;

        // Kiểm tra luồng xử lý
        if (!canDelegate(assignerRoleName, assigneeRoleName)) {
            throw new Error(`"${assignerRoleName}" không được phép chuyển văn bản cho người có vai trò "${assigneeRoleName}" theo luồng xử lý.`);
        }


        if (action === constants.ACTIONS.RETURN) {
            document.assignedUsers = document.assignedUsers.filter(User => User !== assignerId);
            console.log("Danh sách người dùng sau khi xóa người gửi:", document.assignedUsers);
        }

        const actionTemp = (action === constants.ACTIONS.RETURN) ? constants.ACTIONS.RETURN : constants.ACTIONS.DELEGATE;

        const newHistoryEntry = {
            assignerId: assignerId,
            assigneeId: assigneeId,
            action: actionTemp,
            note: note,
            deadline: deadline,
        };

        document.assignedUsers.push(assigneeId);

        document.processingHistory.push(newHistoryEntry);
        document.status = constants.DOCUMENT_STATUS.PROCESSING;

        await document.save();
        return document;
    } catch (error) {
        console.error("Lỗi khi chuyển xử lý văn bản:", error);
        throw error;
    }
};

exports.addProcessor = async (documentId, assignerId, newProcessorId, note, deadline) => {
    try {
        const document = await Document.findById(documentId);

        if (!document) {
            throw new Error('Không tìm thấy văn bản.');
        }

        // Kiểm tra xem người giao việc có phải là người xử lý hiện tại không.
        if (!document.assignedUsers || !document.assignedUsers.includes(assignerId)) {
            throw new Error('Bạn không có quyền thêm người xử lý cho văn bản này.');
        }

        document.processingHistory.push(newHistoryEntry);

        // Tạo một đối tượng lịch sử mới
        const newHistoryEntry = {
            assignerId: assignerId,
            assigneeId: newProcessorId,
            action: constants.ACTIONS.ADD_PROCESSOR,
            note: note,
            deadline: deadline,
        };
        document.processingHistory.push(newHistoryEntry);
        document.status = constants.DOCUMENT_STATUS.PROCESSING;

        await document.save();
        return document;
    } catch (error) {
        console.error("Lỗi khi thêm người xử lý:", error);
        throw error;
    }
};

exports.markAsComplete = async (documentId, processorId) => {
    try {
        const document = await Document.findById(documentId);

        if (!document) {
            throw new Error('Không tìm thấy văn bản.');
        }

        // Kiểm tra xem người thực hiện hành động có nằm trong danh sách người xử lý không.
        if (!document.assignedUsers || !document.assignedUsers.includes(processorId)) {
            throw new Error('Bạn không có quyền đánh dấu văn bản này là hoàn thành.');
        }

        // Tạo một đối tượng lịch sử mới
        const newHistoryEntry = {
            assignerId: processorId,
            assigneeId: processorId,
            action: constants.ACTIONS.MARK_AS_COMPLETE,
            note: 'Văn bản đã được xử lý xong.',
            deadline: Date.now(),
        };

        // Cập nhật trạng thái và thêm vào lịch sử
        document.status = constants.DOCUMENT_STATUS.COMPLETED;
        document.processingHistory.push(newHistoryEntry);

        await document.save();
        return document;
    } catch (error) {
        console.error("Lỗi khi đánh dấu hoàn thành văn bản:", error);
        throw error;
    }
};

exports.recallDocument = async (documentId, requesterId, requesterRoleName) => {
    try {
        // Cán bộ cấp thấp nhất không được phép thu hồi văn bản.
        if (requesterRoleName === 'can_bo') {
            throw new Error('Bạn không có quyền thu hồi văn bản.');
        }

        const document = await Document.findById(documentId);

        if (!document) {
            throw new Error('Không tìm thấy văn bản.');
        }

        // Tìm hành động 'delegate' gần nhất do người yêu cầu thực hiện.
        const lastDelegateAction = document.processingHistory.reverse().find(
            history => history.assignerId.toString() === requesterId && history.action === constants.ACTIONS.DELEGATE
        );
        // Tìm hành động 'recall' gần nhất để kiểm tra.
        const lastRecallAction = document.processingHistory.findLast(
            history => history.assignerId.toString() === requesterId && history.action === constants.ACTIONS.RECALL
        );

        // Nếu không có hành động chuyển giao nào hoặc hành động thu hồi gần hơn.
        if (!lastDelegateAction || (lastRecallAction && lastRecallAction.assignedAt >= lastDelegateAction.assignedAt)) {
            console.log('Không có hành động chuyển giao nào để thu hồi hoặc văn bản đã được thu hồi rồi. Không thực hiện thay đổi nào.');
            return document;
        }

        // Đảo ngược thứ tự mảng lại như cũ.
        document.processingHistory.reverse();

        // Tạo một đối tượng lịch sử mới cho hành động thu hồi.
        const newHistoryEntry = {
            assignerId: requesterId,
            assigneeId: requesterId,
            action: constants.ACTIONS.RECALL,
            note: `Đã thu hồi văn bản từ người dùng ${lastDelegateAction.assigneeId}.`,
            deadline: lastDelegateAction.deadline,
        };

        // Cập nhật danh sách người xử lý: xóa người nhận cũ và thêm người thu hồi vào.
        document.assignedUsers = document.assignedUsers.filter(
            id => id.toString() !== lastDelegateAction.assigneeId.toString()
        );
        document.assignedUsers.push(requesterId);

        // Thêm vào lịch sử xử lý.
        document.processingHistory.push(newHistoryEntry);
        document.status = constants.DOCUMENT_STATUS.PROCESSING;

        await document.save();
        return document;
    } catch (error) {
        console.error("Lỗi khi thu hồi văn bản:", error);
        throw error;
    }
};

exports.updateProcessor = async (documentId, assignerId, newAssigneeId, note, deadline) => {
    try {
        const document = await Document.findById(documentId);

        if (!document) {
            throw new Error('Không tìm thấy văn bản.');
        }

        // Kiểm tra xem người chỉnh sửa có quyền không.
        if (!document.assignedUsers || !document.assignedUsers.includes(assignerId)) {
            throw new Error('Bạn không có quyền chỉnh sửa người xử lý cho văn bản này.');
        }

        // Tạo một đối tượng lịch sử mới
        const newHistoryEntry = {
            assignerId: assignerId,
            assigneeId: newAssigneeId,
            action: constants.ACTIONS.UPDATE_PROCESSOR,
            note: note,
            deadline: deadline,
        };

        // Thêm vào lịch sử xử lý
        document.processingHistory.push(newHistoryEntry);

        await document.save();
        return document;
    } catch (error) {
        console.error("Lỗi khi cập nhật người xử lý:", error);
        throw error;
    }
};