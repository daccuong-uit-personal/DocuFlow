// Các hàm tiện ích chung

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('vi-VN', options);
};

// Hàm mới để định dạng ngày tháng cho input type="date"
const formatDateToInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Sử dụng toISOString() và cắt chuỗi để lấy phần yyyy-MM-dd
    return date.toISOString().split('T')[0];
};

export { formatDate, formatDateToInput };