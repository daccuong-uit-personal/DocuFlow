// Định nghĩa các hằng số (tên quyền, vai trò, trạng thái tài liệu)

module.exports = {
    ROLES: {
        ADMIN: "admin",
        GIAM_DOC: "giam_doc",
        PHO_GIAM_DOC: "pho_giam_doc",
        TRUONG_PHONG: "truong_phong",
        PHO_TRUONG_PHONG: "pho_truong_phong",
        CAN_BO: "can_bo",
        VAN_THU: "van_thu",
    },
    STATUS: {
        DTAFT: "draft",
        PROCESSING: "processing",
        COMPLETED: "completed",
        CANCELED: "canceled"
    },
    RECEIVING_METHOD: {
        ONLINE: "Online",
        OFFLINE: "Offline"
    },
    URGENCY_LEVEL: {
        NORMAL: "Thuong",
        URGENT: "Khan",
        SERIOUS: "HoatToc"
    },
    CONFIDENTIALITY_LEVEL: {
        NORMAL: "BinhThuong",
        CONFIDENTIAL: "Mat",
        SECRET: "ToiMat"
    }
};