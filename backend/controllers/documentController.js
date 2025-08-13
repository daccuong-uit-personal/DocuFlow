// Xử lý các thao tác với văn bản

const DocumentService = require("../services/documentService");

exports.getDocuments = async (req, res) => {
    try {
        const queryOptions = req.query;

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
        const { ids } = req.body;

        if (!ids) {
            return res.status(400).json({ message: "Thiếu chuỗi IDs." });
        }

        let idsArray;

        if (Array.isArray(ids)) {
            idsArray = ids;
        } else {
            idsArray = ids.split(',');
        }

        if (idsArray.length === 0) {
            return res.status(400).json({ message: "Chuỗi IDs không hợp lệ." });
        }
        const result = await DocumentService.deleteManyDocuments(idsArray);

        return res.status(200).json({ message: `Xóa thành công ${result.deletedCount} văn bản.`, deletedCount: result.deletedCount });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi máy chủ khi xóa văn bản.", error: error.message });
    }
};

// Controller để tạo văn bản mới
exports.createDocument = async (req, res) => {
    try {
        const documentData = req.body;
        const creatorId = req.user.id;

        if (!documentData.documentBook || !documentData.summary) {
            return res.status(400).json({ message: "Cần cung cấp đầy đủ thông tin cơ bản của văn bản." });
        }
        
        const newDocument = await DocumentService.createDocument(documentData, creatorId);
        return res.status(201).json({ document: newDocument });
    } catch (error) {
        console.error("Lỗi trong controller createDocument:", error);
        return res.status(400).json({ message: error.message });
    }
};

// Controller để chuyển xử lý văn bản
exports.forwardProcessDocuments = async (req, res) => {
    try {
        const { documentIds, processors, note, deadline } = req.body;
        const assignerId = req.user.id;

        if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
            return res.status(400).json({ message: "Cần cung cấp ít nhất một ID văn bản." });
        }
        if (!processors || !Array.isArray(processors) || processors.length === 0) {
            return res.status(400).json({ message: "Cần cung cấp ít nhất một người xử lý." });
        }

        const updatedDocuments = await DocumentService.forwardProcessDocuments(documentIds, assignerId, processors, note, deadline);
        return res.status(200).json({ documents: updatedDocuments });
    } catch (error) {
        console.error("Lỗi trong controller forwardProcessDocuments:", error);
        return res.status(400).json({ message: error?.message || "Có lỗi xảy ra." });
    }
};

// Controller để trả lại văn bản
exports.returnDocuments = async (req, res) => {
    try {
        const { documentIds, note } = req.body;
        const assigneeId = req.user.id;

        if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
            return res.status(400).json({ message: "Cần cung cấp ít nhất một ID văn bản." });
        }

        const updatedDocuments = await DocumentService.returnDocuments(documentIds, assigneeId, note);
        return res.status(200).json({ documents: updatedDocuments });
    } catch (error) {
        console.error("Lỗi trong controller returnDocuments:", error);
        return res.status(400).json({ message: error?.message || "Có lỗi xảy ra." });
    }
};

// Controller để đánh dấu văn bản đã hoàn thành
exports.markAsComplete = async (req, res) => {
    try {
        const { documentIds } = req.body;
        const processorId = req.user.id;

        if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
            return res.status(400).json({ message: "Cần cung cấp ít nhất một ID văn bản." });
        }

        const updatedDocuments = await DocumentService.markAsComplete(documentIds, processorId);
        return res.status(200).json({ documents: updatedDocuments });
    } catch (error) {
        console.error("Lỗi trong controller markAsComplete:", error);
        return res.status(400).json({ message: error?.message || "Có lỗi xảy ra." });
    }
};