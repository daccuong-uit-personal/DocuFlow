// Logic nghiệp vụ cho văn bản

const mongoose = require("mongoose");
const Document = require("../models/Document");

exports.createDocument = async (documentData, userId) => {
    try {
        const document = new Document({
            ...documentData,
            status: 'Draft',
            createBy: userId
        });

        await document.save();
        console.log("Document saved successfully:", document);
        return document;
    }
    catch (error) {
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

        // Thực hiện truy vấn MongoDB với tất cả các điều kiện đã xây dựng
        const documents = await Document.find(query);
        return documents;
    } catch (error) {
        console.error("Error searching and filtering documents:", error);
        throw error;
    }
};

exports.delegateDocument = async (documentId, assignerId, assigneeId, note) => {
    try {
        const document = await Document.findById(documentId);

        if (!document) {
            throw new Error('Không tìm thấy văn bản.');
        }

        if (document.currentProcessor.toString() !== assignerId.toString()) {
            throw new Error('Bạn không có quyền chuyển văn bản này.');
        }

        const newHistoryEntry = {
            assignerId: assignerId,
            assigneeId: assigneeId,
            action: 'delegate',
            note: note,
        };

        document.currentProcessor = assigneeId;
        document.processingHistory.push(newHistoryEntry);
        document.status = 'in-progress';

        await document.save();
        return document;
    } catch (error) {
        console.error("Lỗi khi chuyển xử lý văn bản:", error);
        throw error;
    }
};

exports.addProcessor = async (documentId, assignerId, newProcessorId, note) => {
    try {
        const document = await Document.findById(documentId);

        if (!document) {
            throw new Error('Không tìm thấy văn bản.');
        }

        // Kiểm tra xem người giao việc có phải là người xử lý hiện tại không.
        if (document.currentProcessor.toString() !== assignerId.toString()) {
            throw new Error('Bạn không có quyền thêm người xử lý cho văn bản này.');
        }

        // Tạo một đối tượng lịch sử mới
        const newHistoryEntry = {
            assignerId: assignerId,
            assigneeId: newProcessorId,
            action: 'addProcessor',
            note: note,
        };

        document.processingHistory.push(newHistoryEntry);

        await document.save();
        return document;
    } catch (error) {
        console.error("Lỗi khi thêm người xử lý:", error);
        throw error;
    }
};
