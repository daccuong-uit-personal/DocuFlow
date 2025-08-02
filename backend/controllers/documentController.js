// Xử lý các thao tác với văn bản

const DocumentService = require("../services/documentService");

exports.createDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        const document = await DocumentService.createDocument(req.body, userId);
        return res.status(201).json({ document });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

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
        return res.status(200).json({ document });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Chuyển xử lý văn bản cho người khác
exports.delegateDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { assigneeId, note } = req.body;
        const assignerId = req.user.id; // Lấy ID của người giao việc từ token đã xác thực

        const updatedDocument = await documentService.delegateDocument(documentId, assignerId, assigneeId, note);
        return res.status(200).json({ document: updatedDocument });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Thêm người xử lý mới vào văn bản
exports.addProcessor = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { newProcessorId, note } = req.body;
        const assignerId = req.user.id; // Lấy ID của người giao việc từ token đã xác thực

        const updatedDocument = await documentService.addProcessor(documentId, assignerId, newProcessorId, note);
        return res.status(200).json({ document: updatedDocument });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};