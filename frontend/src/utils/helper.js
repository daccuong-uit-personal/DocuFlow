// src/utils/helper.js
import { toast } from 'react-toastify';

/* ==========================
   ĐỊNH DẠNG NGÀY GIỜ
========================== */

/**
 * Định dạng ngày tháng dạng dd/MM/yyyy HH:mm (cho hiển thị UI)
 */
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return date.toLocaleDateString('vi-VN', options);
};

/**
 * Định dạng ngày tháng cho input type="date" (yyyy-MM-dd)
 */
export const formatDateToInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

/* ==========================
   HỖ TRỢ API & TOAST
========================== */

/**
 * Hiển thị lỗi ra toast + log, không throw để tránh crash UI.
 */
export const handleError = (err, fallbackMessage = 'Có lỗi xảy ra.', showToast = true) => {
    const message = err?.response?.data?.message || err?.message || fallbackMessage;
    if (showToast) toast.error(message);
    console.error('[API ERROR]', message, err);
    return null;
};

/**
 * Hiển thị thông báo thành công ra toast.
 */
export const handleSuccess = (message, showToast = true) => {
    if (message && showToast) {
        toast.success(message);
    }
    console.log('[API SUCCESS]', message);
};

/**
 * Thực thi API call an toàn, tự bắt lỗi và hiện toast.
 * Luôn trả về dữ liệu hoặc null, tránh throw gây crash UI.
 */
export const safeApiCall = async (apiFn, args = [], successMessage = '', fallbackMessage = '', showToast = true) => {
    try {
        const result = await apiFn(...args);
        if (successMessage) handleSuccess(successMessage, showToast);
        return result;
    } catch (err) {
        return handleError(err, fallbackMessage || 'Có lỗi xảy ra.', showToast);
    }
};