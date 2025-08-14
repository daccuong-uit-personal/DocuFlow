// Logic nghiệp vụ cho văn bản

const mongoose = require("mongoose");
const Document = require("../models/Document");
const User = require("../models/User");
const constants = require("../constants/constants");
const { canDelegate, getAllLowerRoles } = require("./roleFlowService");

const BusinessError = require("../utils/BusinessError");

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
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
        throw new BusinessError("ID văn bản không hợp lệ.", 400);
    }
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
            throw new BusinessError("Không tìm thấy văn bản.", 404);
        }
        return document;
    } catch (error) {
        if (error instanceof BusinessError) {
            throw error;
        }
        console.error("Lỗi khi lấy thông tin văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi lấy thông tin văn bản.", 500);
    }
};

exports.updateDocument = async (documentId, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
        throw new BusinessError("ID văn bản không hợp lệ.", 400);
    }

    try {
        const document = await Document.findByIdAndUpdate(documentId, updatedData, { new: true });

        if (!document) {
            throw new BusinessError("Không tìm thấy văn bản.", 404);
        }

        return document;
    } catch (error) {
        if (error instanceof BusinessError) throw error;
        console.error("Lỗi khi cập nhật văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi cập nhật văn bản.", 500);
    }
};

exports.deleteDocument = async (documentId) => {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
        throw new BusinessError("ID văn bản không hợp lệ.", 400);
    }

    try {
        const document = await Document.findByIdAndDelete(documentId);

        if (!document) {
            throw new BusinessError("Không tìm thấy văn bản.", 404);
        }

        return document;
    } catch (error) {
        if (error instanceof BusinessError) throw error;
        console.error("Lỗi khi xóa văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi xóa văn bản.", 500);
    }
};

exports.deleteManyDocuments = async (documentIds) => {
    if (!Array.isArray(documentIds) || documentIds.length === 0) {
        throw new BusinessError("Danh sách IDs không hợp lệ.", 400);
    }

    // Kiểm tra tất cả ID có hợp lệ không
    for (const id of documentIds) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BusinessError(`ID không hợp lệ: ${id}`, 400);
        }
    }

    try {
        const result = await Document.deleteMany({ _id: { $in: documentIds } });
        console.log(`${result.deletedCount} documents deleted successfully.`);
        return result;
    } catch (error) {
        if (error instanceof BusinessError) throw error;
        console.error("Lỗi khi xóa nhiều văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi xóa nhiều văn bản.", 500);
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

        if (documentBook) query.documentBook = documentBook;
        if (documentNumber) query.documentNumber = documentNumber;
        if (sendingUnit) query.sendingUnit = sendingUnit;
        if (recivingUnit) query.recivingUnit = recivingUnit;
        if (receivingMethod) query.receivingMethod = receivingMethod;
        if (urgencyLevel) query.urgencyLevel = urgencyLevel;
        if (confidentialityLevel) query.confidentialityLevel = confidentialityLevel;
        if (documentType) query.documentType = documentType;
        if (category) query.category = category;
        if (signer) query.signer = signer;

        if (status) {
            if (status === 'returned') {
                query['currentAssignments.status'] = 'returned';
                query['currentAssignments.userId'] = user.id;
            } else {
                query.status = status;
            }
        }

        if (recivedDateFrom || recivedDateTo) {
            query.recivedDate = {};
            if (recivedDateFrom) query.recivedDate.$gte = recivedDateFrom;
            if (recivedDateTo) query.recivedDate.$lte = recivedDateTo;
        }

        if (dueDateFrom || dueDateTo) {
            query.dueDate = {};
            if (dueDateFrom) query.dueDate.$gte = dueDateFrom;
            if (dueDateTo) query.dueDate.$lte = dueDateTo;
        }

        const documents = await Document.find(query).sort({ recivedDate: -1 });
        return documents;
    } catch (error) {
        if (error instanceof BusinessError) throw error;
        console.error("Lỗi khi tìm kiếm và lọc văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi tìm kiếm văn bản.", 500);
    }
};

// Tạo một văn bản mới với trạng thái DRAFT.
exports.createDocument = async (documentData, creatorId) => {
    if (!documentData.documentBook || !documentData.summary) {
        throw new BusinessError("Cần cung cấp đầy đủ thông tin cơ bản của văn bản.", 400);
    }

    try {
        const newDocument = new Document({
            ...documentData,
            createdBy: creatorId,
        });

        const historyEntry = createHistoryEntry('createDocument', creatorId, {
            note: 'Văn bản được khởi tạo.'
        });
        newDocument.processingHistory.push(historyEntry);

        await newDocument.save();
        return newDocument;
    } catch (error) {
        if (error instanceof BusinessError) throw error;
        console.error("Lỗi khi tạo văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi tạo văn bản.", 500);
    }
};

// Chuyển xử lý văn bản cho người khác.
exports.forwardProcessDocuments = async (documentIds, assignerId, processors, note, deadline) => {
    if (!Array.isArray(documentIds) || documentIds.length === 0) {
        throw new BusinessError("Cần cung cấp ít nhất một ID văn bản.", 400);
    }
    if (!Array.isArray(processors) || processors.length === 0) {
        throw new BusinessError("Cần cung cấp ít nhất một người xử lý.", 400);
    }

    try {
        const documents = await Document.find({ _id: { $in: documentIds } });
        if (!documents || documents.length === 0) {
            throw new BusinessError("Không tìm thấy văn bản nào.", 404);
        }

        const updatedDocuments = [];

        const assignerUser = await User.findById(assignerId).populate('role', 'name');
        if (!assignerUser) {
            throw new BusinessError("Không tìm thấy người giao việc.", 404);
        }

        const processorUserIds = processors.map(p => p.userId);
        const processorUsers = await User.find({ _id: { $in: processorUserIds } }).populate('role', 'name');
        if (processorUsers.length !== processors.length) {
            throw new BusinessError("Một hoặc nhiều người nhận việc không tồn tại.", 404);
        }

        for (const doc of documents) {
            const isAssignerCreator = doc.createdBy.equals(assignerId);
            const assignerAssignment = doc.currentAssignments.find(a =>
                a.userId.equals(assignerId) &&
                a.status === 'processing' &&
                ['mainProcessor', 'collaborator'].includes(a.role)
            );

            if (!isAssignerCreator && !assignerAssignment) {
                throw new BusinessError(
                    `Người dùng ${assignerId} không có quyền chuyển tiếp văn bản ${doc._id}.`,
                    403
                );
            }

            for (const p of processors) {
                const processorUser = processorUsers.find(u => u._id.equals(p.userId));
                if (!canDelegate(assignerUser.role.name, processorUser.role.name)) {
                    throw new BusinessError(
                        `Vai trò của người giao việc (${assignerUser.role.name}) không thể chuyển tiếp cho vai trò của người nhận việc (${processorUser.role.name}).`,
                        403
                    );
                }
            }

            const existingMainProcessor = doc.currentAssignments.some(a => a.role === 'mainProcessor' && a.status === 'processing');
            const newMainProcessorCount = processors.filter(p => p.role === 'mainProcessor').length;

            if (newMainProcessorCount > 1) {
                throw new BusinessError("Không thể chỉ định nhiều hơn một người xử lý chính.", 400);
            }

            if (existingMainProcessor && newMainProcessorCount === 1) {
                throw new BusinessError("Đã có người xử lý chính đang hoạt động.", 400);
            }

            const newAssignments = [];

            for (const p of processors) {
                const existingAssignment = doc.currentAssignments.find(a => a.userId.equals(p.userId));

                if (!existingAssignment) {
                    newAssignments.push(createProcessingAssignment(p, assignerId, note, deadline));
                } else if (existingAssignment.status === 'processing') {
                    continue;
                } else if (['completed', 'returned'].includes(existingAssignment.status)) {
                    existingAssignment.status = 'processing';
                    existingAssignment.note = note;
                    existingAssignment.deadline = deadline;
                    existingAssignment.assignedBy = assignerId;
                    existingAssignment.assignedAt = new Date();
                }
            }

            doc.currentAssignments.push(...newAssignments);
            doc.status = constants.DOCUMENT_STATUS.PROCESSING;

            const historyEntry = createHistoryEntry('forwardProcessing', assignerId, {
                processors: processors.map(p => ({ userId: p.userId, role: p.role })),
                note
            });
            doc.processingHistory.push(historyEntry);

            await doc.save();
            updatedDocuments.push(doc);
        }

        return updatedDocuments;
    } catch (error) {
        if (error instanceof BusinessError) throw error;
        console.error("Lỗi khi chuyển xử lý văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi chuyển xử lý văn bản.", 500);
    }
};

// Trả lại văn bản cho người đã giao trước đó
exports.returnDocuments = async (documentIds, assigneeId, note) => {
    if (!Array.isArray(documentIds) || documentIds.length === 0) {
        throw new BusinessError("Cần cung cấp ít nhất một ID văn bản.", 400);
    }

    try {
        const processorUser = await User.findById(assigneeId).populate('role', 'name');
        if (!processorUser) {
            throw new BusinessError("Không tìm thấy người dùng.", 404);
        }

        const documents = await Document.find({ _id: { $in: documentIds } })
            .populate({
                path: 'currentAssignments.userId',
                select: 'role',
                populate: {
                    path: 'role',
                    select: 'name'
                }
            });

        if (!documents || documents.length === 0) {
            throw new BusinessError("Không tìm thấy văn bản nào.", 404);
        }

        const updatedDocuments = [];

        for (const doc of documents) {
            const assignmentToReturn = doc.currentAssignments.find(
                a => a.userId.equals(assigneeId) && a.status === 'processing'
            );

            if (!assignmentToReturn) {
                throw new BusinessError(`Bạn không có nhiệm vụ đang chờ xử lý với văn bản ${doc._id}.`, 403);
            }

            const assignerId = assignmentToReturn.assignedBy;
            if (!assignerId) {
                throw new BusinessError(`Không tìm thấy người đã giao nhiệm vụ cho bạn trong văn bản ${doc._id}.`, 404);
            }

            // Case đặc biệt: xử lý chính trả lại cho người tạo
            if (doc.createdBy.equals(assignerId) && assignmentToReturn.role === 'mainProcessor') {
                doc.currentAssignments.forEach(a => {
                    if (a.status !== 'returned') {
                        a.status = 'returned';
                    }
                });

                doc.status = constants.DOCUMENT_STATUS.DRAFT;

                doc.processingHistory.push(createHistoryEntry(
                    'returnDocument',
                    assigneeId,
                    {
                        note: note || 'Người xử lý chính trả lại cho người tạo, văn bản trở về trạng thái khởi tạo.'
                    }
                ));

                doc.lastReturnReason = note || '';
                doc.lastReturnedBy = assigneeId;
                doc.lastReturnedAt = new Date();

                await doc.save();
                updatedDocuments.push(doc);
                continue;
            }

            // Auto return tất cả cấp dưới
            const lowerRoles = getAllLowerRoles(processorUser.role.name);
            const subAssignments = doc.currentAssignments.filter(a =>
                a.userId?.role?.name &&
                lowerRoles.includes(a.userId.role.name) && 
                a.status !== 'returned'
            );

            for (const sub of subAssignments) {
                sub.status = 'returned';
            }

            if (subAssignments.length > 0) {
                doc.processingHistory.push(createHistoryEntry(
                    'returnDocument',
                    assigneeId,
                    {
                        processors: subAssignments.map(sa => ({ userId: sa.userId })),
                        note: 'Tự động trả lại các nhiệm vụ cấp dưới khi trả văn bản.'
                    }
                ));
            }

            assignmentToReturn.status = 'returned';
            doc.processingHistory.push(createHistoryEntry(
                'returnDocument',
                assigneeId,
                { 
                    processors: [{ userId: assignerId }],
                    note: note || ''
                }
            ));

            doc.lastReturnReason = note || '';
            doc.lastReturnedBy = assigneeId;
            doc.lastReturnedAt = new Date();
            doc.status = constants.DOCUMENT_STATUS.PROCESSING;

            await doc.save();
            updatedDocuments.push(doc);
        }

        return updatedDocuments;
    } catch (error) {
        if (error instanceof BusinessError) throw error;
        console.error("Lỗi khi trả văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi trả văn bản.", 500);
    }
};

// Đánh dấu hoàn thành văn bản
exports.markAsComplete = async (documentIds, processorId, note) => {
    if (!Array.isArray(documentIds) || documentIds.length === 0) {
        throw new BusinessError("Cần cung cấp ít nhất một ID văn bản.", 400);
    }

    try {
        const processorUser = await User.findById(processorId).populate('role', 'name');
        if (!processorUser) {
            throw new BusinessError("Không tìm thấy người dùng.", 404);
        }

        const documents = await Document.find({ _id: { $in: documentIds } });
        if (!documents || documents.length === 0) {
            throw new BusinessError("Không tìm thấy văn bản nào.", 404);
        }

        const updatedDocuments = [];

        for (const doc of documents) {
            const isCreator = doc.createdBy.equals(processorId);

            const alreadyCompletedAssignment = doc.currentAssignments.find(a =>
                a.userId.equals(processorId) && a.status === 'completed'
            );
            if (alreadyCompletedAssignment) {
                throw new BusinessError("Bạn đã hoàn thành nhiệm vụ này trước đó.", 400);
            }

            const currentAssignment = doc.currentAssignments.find(a =>
                a.userId.equals(processorId) && a.status === 'processing'
            );
            if (!isCreator && !currentAssignment) {
                throw new BusinessError(`Người dùng ${processorId} không có quyền hoàn thành văn bản ${doc._id}.`, 403);
            }

            if (currentAssignment?.role === 'inform') {
                throw new BusinessError(`Người dùng ${processorId} chỉ nhận để biết và không thể đánh dấu hoàn thành văn bản ${doc._id}.`, 403);
            }

            const lowerRoles = getAllLowerRoles(processorUser.role.name);

            const myAssignedLower = [];
            for (const assignment of doc.currentAssignments) {
                if (assignment.assignedBy.equals(processorId)) {
                    const assigneeUser = await User.findById(assignment.userId).populate('role', 'name');
                    if (lowerRoles.includes(assigneeUser.role.name)) {
                        myAssignedLower.push(assignment);
                    }
                }
            }

            const unfinishedLower = myAssignedLower.some(a => a.status !== 'completed');
            if (unfinishedLower) {
                throw new BusinessError(`Không thể hoàn thành vì vẫn còn người ở cấp dưới do bạn giao chưa xử lý xong trong văn bản ${doc._id}.`, 400);
            }

            if (currentAssignment?.role === 'mainProcessor') {
                doc.currentAssignments.forEach(a => a.status = 'completed');
                doc.status = constants.DOCUMENT_STATUS.COMPLETED;
            } else {
                currentAssignment.status = 'completed';
                const allCompleted = doc.currentAssignments.every(a => a.status === 'completed');
                doc.status = allCompleted ? constants.DOCUMENT_STATUS.COMPLETED : constants.DOCUMENT_STATUS.PROCESSING;
            }

            doc.processingHistory.push(createHistoryEntry(
                'completeProcessing',
                processorId,
                { note: note || 'Nhiệm vụ đã được hoàn thành.' }
            ));

            await doc.save();
            updatedDocuments.push(doc);
        }

        return updatedDocuments;
    } catch (error) {
        if (error instanceof BusinessError) throw error;
        console.error("Lỗi khi đánh dấu hoàn thành văn bản:", error);
        throw new BusinessError("Đã xảy ra lỗi hệ thống khi đánh dấu hoàn thành văn bản.", 500);
    }
};