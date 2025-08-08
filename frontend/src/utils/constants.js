// Định nghĩa các hằng số (ROLES, DOCUMENT_STATUS, PERMISSIONS_LIST)

const CONSTANTS = {
    ROLES: {
        ADMIN: "admin",
        GIAM_DOC: "giam_doc",
        PHO_GIAM_DOC: "pho_giam_doc",
        TRUONG_PHONG: "truong_phong",
        PHO_TRUONG_PHONG: "pho_truong_phong",
        CAN_BO: "can_bo",
        VAN_THU: "van_thu",
        TRUONG_PHONG_SO_LOAI: "truong_phong_so_loai"
    },
    GENDER: {
        MALE: "Nam",
        FEMALE: "Nữ",
        OTHER: "Khác"
    },
    DOCUMENT_STATUS: {
        DRAFT: "Draft",
        PENDING_APPROVAL: "PendingApproval",
        PROCESSING: "Processing",
        COMPLETED: "Completed",
        REJECTED: "Rejected",
        CANCELED: "Canceled",
        COORDINATION: "Coordination",
        FOR_INFORMATION: "ForInformation",
    },
    RECEIVING_METHOD: {
        ONLINE: "Online",
        OFFLINE: "Offline"
    },
    URGENCY_LEVEL: {
        NORMAL: "Thường",
        URGENT: "Khẩn",
        EMERGENCY: "Hoả tốc"
    },
    CONFIDENTIALITY_LEVEL: {
        NORMAL: "Bình thường",
        CONFIDENTIAL: "Mật",
        SECRET: "Tối mật"
    },
    ACTIONS: {
        DELEGATE: "delegate", // Chuyển giao hoàn toàn quyền xử lý
        ADD_PROCESSOR: "addProcessor", // Thêm người phối hợp
        MARK_COMPLETE: "markComplete", // Đánh dấu đã hoàn thành
        RECALL: "recall", // Thu hồi văn bản
        UPDATE_ASSIGNMENT: 'updateAssignment', // Cập nhật thông tin giao việc (ví dụ: deadline)
        RETURN: 'return', // Trả lại văn bản cho người giao việc trước đó
        REJECT: 'reject' // Từ chối phê duyệt văn bản
    },
};

export default CONSTANTS;