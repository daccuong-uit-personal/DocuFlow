// Logic nghiệp vụ cho văn bản

const mongoose = require("mongoose");
const Document = require("../models/Document");

exports.createDocument = async (documentData) => {
    try {
        const document = new Document({
            ...documentData,
            status: 'Draft',
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


