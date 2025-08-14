// Xử lý các thao tác với văn bản

const DocumentService = require("../services/documentService");

exports.getDocuments = async (req, res, next) => {
    try {
        const queryOptions = { ...req.query };
        const user = req.user;

        if (queryOptions.recivedDateFrom) {
            queryOptions.recivedDateFrom = new Date(queryOptions.recivedDateFrom);
        }
        if (queryOptions.recivedDateTo) {
            queryOptions.recivedDateTo = new Date(queryOptions.recivedDateTo);
        }
        if (queryOptions.dueDateFrom) {
            queryOptions.dueDateFrom = new Date(queryOptions.dueDateFrom);
        }
        if (queryOptions.dueDateTo) {
            queryOptions.dueDateTo = new Date(queryOptions.dueDateTo);
        }

        const documents = await DocumentService.searchAndFilterDocuments(queryOptions, user);
        res.status(200).json(documents);
    } catch (error) {
        next(error);
    }
};

exports.getDocumentById = async (req, res, next) => {
    try {
        const document = await DocumentService.getDocumentById(req.params.id);
        res.status(200).json({ document });
    } catch (error) {
        next(error);
    }
};

exports.updateDocument = async (req, res, next) => {
    try {
        const document = await DocumentService.updateDocument(req.params.id, req.body);
        res.status(200).json({ document });
    } catch (error) {
        next(error);
    }
};

exports.deleteDocument = async (req, res, next) => {
    try {
        await DocumentService.deleteDocument(req.params.id);
        res.status(200).json({ message: "Xóa văn bản thành công." });
    } catch (error) {
        next(error);
    }
};

exports.deleteManyDocuments = async (req, res, next) => {
    try {
        const { ids } = req.body;

        // Cho phép ids dạng mảng hoặc chuỗi
        const idsArray = Array.isArray(ids) ? ids : ids?.split(",").map(id => id.trim());

        const result = await DocumentService.deleteManyDocuments(idsArray);

        res.status(200).json({
            message: `Xóa thành công ${result.deletedCount} văn bản.`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        next(error);
    }
};

// Controller để tạo văn bản mới
exports.createDocument = async (req, res, next) => {
    try {
        const documentData = req.body;
        const creatorId = req.user.id;

        const newDocument = await DocumentService.createDocument(documentData, creatorId);
        res.status(201).json({ document: newDocument });
    } catch (error) {
        next(error);
    }
};

// Controller để chuyển xử lý văn bản
exports.forwardProcessDocuments = async (req, res, next) => {
    try {
        const { documentIds, processors, note, deadline } = req.body;
        const assignerId = req.user.id;

        const updatedDocuments = await DocumentService.forwardProcessDocuments(
            documentIds, assignerId, processors, note, deadline
        );

        res.status(200).json({ documents: updatedDocuments });
    } catch (error) {
        next(error);
    }
};

// Controller để trả lại văn bản
exports.returnDocuments = async (req, res, next) => {
    try {
        const { documentIds, note } = req.body;
        const assigneeId = req.user.id;

        const updatedDocuments = await DocumentService.returnDocuments(documentIds, assigneeId, note);
        res.status(200).json({ documents: updatedDocuments });
    } catch (error) {
        next(error);
    }
};

// Controller để đánh dấu văn bản đã hoàn thành
exports.markAsComplete = async (req, res, next) => {
    try {
        const { documentIds, note } = req.body;
        const processorId = req.user.id;

        const updatedDocuments = await DocumentService.markAsComplete(documentIds, processorId, note);
        res.status(200).json({ documents: updatedDocuments });
    } catch (error) {
        next(error);
    }
};