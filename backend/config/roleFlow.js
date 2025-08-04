// Cấu hình luồng chuyển giao văn bản.

const roleHierarchy = {
    'van_thu': ['truong_phong_so_loai', 'giam_doc'],
    'truong_phong_so_loai': ['giam_doc'],
    'giam_doc': ['pho_giam_doc'],
    'pho_giam_doc': ['truong_phong'],
    'truong_phong': ['pho_truong_phong'],
    'pho_truong_phong': ['can_bo']
};

module.exports = { roleHierarchy };
