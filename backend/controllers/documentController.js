// Xử lý các thao tác với văn bản

const DocumentService = require("../services/documentService");

exports.createDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        // Lấy danh sách tên file đã upload
        const attachments = req.files ? req.files.map(file => file.filename) : [];

        const documentData = {
            ...req.body,
            attachments: attachments,
        };

        const document = await DocumentService.createDocument(documentData, userId);
        return res.status(201).json({ message: "Tạo văn bản thành công!", document });
    } catch (error) {
        console.error("Lỗi trong controller createDocument:", error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const queryOptions = req.query;

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

        const documents = await DocumentService.searchAndFilterDocuments(queryOptions);

        res.status(200).json(documents);
    } catch (error) {
        console.error("Lỗi trong controller getDocuments:", error);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách văn bản.", error: error.message });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const document = await DocumentService.getDocumentById(req.params.id);
        return res.status(200).json({ document });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.updateDocument = async (req, res) => {
    try {
        const document = await DocumentService.updateDocument(req.params.id, req.body);
        return res.status(200).json({ document });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.deleteDocument = async (req, res) => {
    try {
        const document = await DocumentService.deleteDocument(req.params.id);
        if (!document) {
            return res.status(404).json({ message: "Không tìm thấy văn bản." });
        }
        return res.status(200).json({ message: "Xóa văn bản thành công." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteManyDocuments = async (req, res) => {
    try {
        const { ids } = req.query;

        if (!ids) {
            return res.status(400).json({ message: "Thiếu chuỗi IDs." });
        }

        const idsArray = ids.split(','); 

        if (idsArray.length === 0) {
             return res.status(400).json({ message: "Chuỗi IDs không hợp lệ." });
        }

        const result = await DocumentService.deleteManyDocuments(idsArray);

        return res.status(200).json({ message: `Xóa thành công ${result.deletedCount} văn bản.`, deletedCount: result.deletedCount });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi máy chủ khi xóa văn bản.", error: error.message });
    }
};

// Chuyển xử lý văn bản cho người khác
exports.delegateDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const assigneeId = req.body.assigneeId;
        const note = req.body.note;
        const deadline = req.body.deadline;
        const assignerId = req.user.id;
        const action = req.body.action;
        const assignerRoleName = req.user.roleName;

        const updatedDocument = await DocumentService.delegateDocument(documentId, assignerId, assigneeId, note, deadline, assignerRoleName, action);
        return res.status(200).json({ document: updatedDocument });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Thêm người xử lý mới vào văn bản
exports.addProcessor = async (req, res) => {
    try {
        const documentId = req.params.id;
        const newProcessorId = req.body.newProcessorId;
        const note = req.body.note;
        const assignerId = req.user.id;
        const deadline = req.body.deadline;

        const updatedDocument = await DocumentService.addProcessor(documentId, assignerId, newProcessorId, note, deadline);
        return res.status(200).json({ document: updatedDocument });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Đánh dấu văn bản đã hoàn thành
exports.markAsComplete = async (req, res) => {
    try {
        const documentId = req.params.id;
        const processorId = req.user.id;

        const updatedDocument = await DocumentService.markAsComplete(documentId, processorId);
        return res.status(200).json({ document: updatedDocument });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Thu hồi văn bản
exports.recallDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const requesterId = req.user.id;
        const requesterRoleName = req.user.roleName;

        const updatedDocument = await DocumentService.recallDocument(documentId, requesterId, requesterRoleName);
        return res.status(200).json({ document: updatedDocument });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.updateProcessor = async (req, res) => {
    try {
        const documentId = req.params.id;
        const newAssigneeId = req.body.newAssigneeId;
        const note = req.body.note;
        const deadline = req.body.deadline;
        const assignerId = req.user.id;

        const updatedDocument = await DocumentService.updateProcessor(documentId, assignerId, newAssigneeId, note, deadline);
        return res.status(200).json({ document: updatedDocument });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};