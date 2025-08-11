import React from 'react';
import { formatDate } from '../../utils/helper';

const getActionLabel = (action) => {
    switch (action) {
        case 'delegate':
            return 'Chuyển xử lý';

        case 'addProcessor':
            return 'Thêm người xử lý';
        case 'update-processor':
        case 'updateAssignment':
            return 'Cập nhật người xử lý';
        case 'return':
            return 'Trả lại';
        case 'recall':
            return 'Thu hồi';
        case 'mark-complete':
        case 'markComplete':
            return 'Hoàn thành';
        default:
            return 'Không xác định';
    }
};

const getActionColor = (action) => {
    switch (action) {
        case 'delegate':
        case 'add-processor':
        case 'addProcessor':
        case 'update-processor':
        case 'updateAssignment':
            return 'bg-indigo-100 text-indigo-800';
        case 'mark-complete':
        case 'markComplete':
            return 'bg-green-100 text-green-800';
        case 'return':
        case 'recall':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const ProcessingHistoryTable = ({ history = [] }) => {
    if (!history || history.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                Không có lịch sử xử lý.
            </div>
        );
    }

    return (
        <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lịch sử xử lý</label>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-12 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th scope="col" className="w-32 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                            <th scope="col" className="w-40 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người thực hiện
                            </th>
                            <th scope="col" className="w-40 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người liên quan
                            </th>
                            <th scope="col" className="w-32 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thời gian
                            </th>
                            <th scope="col" className="w-auto px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ghi chú
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {history.map((item, index) => (
                            <tr key={item._id}>
                                <td className="w-12 px-2 py-4 text-sm font-medium text-gray-900 truncate">
                                    {index + 1}
                                </td>
                                <td className="w-32 px-2 py-4 text-sm text-gray-500 truncate">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(item.action)}`}>
                                        {getActionLabel(item.action)}
                                    </span>
                                </td>
                                <td className="w-40 px-2 py-4 text-sm text-gray-500 truncate">
                                    {item.actorId?.name}
                                </td>
                                <td className="w-40 px-2 py-4 text-sm text-gray-500 truncate">
                                    {item.details && item.details.processors && item.details.processors.length > 0
                                        ? item.details.processors.map(p => p.userId?.name).join(', ')
                                        : item.details?.assigneeId?.name || 'N/A'
                                    }
                                </td>
                                <td className="w-32 px-2 py-4 text-sm text-gray-500 truncate">
                                    {item.timestamp ? formatDate(item.timestamp) : 'N/A'}
                                </td>
                                <td className="w-auto px-2 py-4 text-sm text-gray-500">
                                    <div className="truncate w-full max-w-xs">
                                        {item.details?.note || 'Không có ghi chú'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProcessingHistoryTable;