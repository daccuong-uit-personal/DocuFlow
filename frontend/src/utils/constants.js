// Định nghĩa các hằng số (ROLES, DOCUMENT_STATUS, PERMISSIONS_LIST)

const constants = {
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
        PROCESSING: "Processing",
        COMPLETED: "Completed",
        RETURNED: "returned",
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
        DELEGATE: "delegate",
        MARK_COMPLETE: "markComplete",
        RETURN: 'return',
    },
};

export default constants;