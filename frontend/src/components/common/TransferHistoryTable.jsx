import React from 'react';
import { formatDate } from '../../utils/helper';

const getActionLabel = (action) => {
    switch (action) {
        case 'delegate':
            return 'Chuyển xử lý';
        case 'approve':
            return 'Phê duyệt';
        case 'reject':
            return 'Từ chối';
        case 'comment':
            return 'Ghi chú';
        default:
            return 'Không xác định';
    }
};

const TransferHistoryTable = ({ history = [] }) => {
    if (!history || history.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                Không có lịch sử chuyển giao.
            </div>
        );
    }

    return (
        <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lịch sử chuyển giao</label>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên người gửi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên người nhận
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hạn xử lý
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái văn bản
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {history.map((item, index) => (
                            <tr key={item._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.assignerId?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.assigneeId.map(user => user.name).join(', ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.deadline ? formatDate(item.deadline) : 'Không có'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.action === 'delegate' ? 'bg-indigo-100 text-indigo-800' :
                                            item.action === 'approve' ? 'bg-green-100 text-green-800' :
                                                item.action === 'reject' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {getActionLabel(item.action)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransferHistoryTable;