import React from 'react';
import { formatDate } from '../../utils/helper';

const AssignedUsersList = ({ assignedTo }) => {
    const visibleAssignments = Array.isArray(assignedTo)
        ? assignedTo.filter(a => a.status !== 'rejected')
        : [];

    if (!visibleAssignments || visibleAssignments.length === 0) {
        return (
            <div className="bg-white p-4 rounded-xl shadow-md mt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Người được giao xử lý
                </h3>
                <p className="text-gray-500 text-sm">Chưa có người được giao xử lý.</p>
            </div>
        );
    }

    // Hàm để chuyển đổi giá trị tiếng Anh sang tiếng Việt
    const getTranslatedValue = (value) => {
        switch (value) {
            case 'read':
                return 'Xử lý';
            case 'collaborate':
                return 'Phối hợp';
            case 'inform':
                return 'Nhận để biết';
            case 'pending':
                return 'Chờ xử lý';
            case 'completed':
                return 'Hoàn thành';
            default:
                return value;
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md mt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Người được giao xử lý
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên người dùng
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vai trò
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hạn chót
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ghi chú
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {visibleAssignments.map((assignment, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.userId?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getTranslatedValue(assignment.role)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getTranslatedValue(assignment.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.deadline ? formatDate(assignment.deadline) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {assignment.note || 'Không có'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedUsersList;