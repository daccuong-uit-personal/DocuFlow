// components/DocumentProcessModal.js
import React, { useState, useEffect } from 'react';
// Sửa đổi: Sử dụng DocumentContext trực tiếp thay vì useDocuments()
import { useDocuments } from '../../hooks/useDocuments';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';

import roleHierarchy from '../../utils/roleFlow';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Map vai trò sang tiếng Việt để hiển thị
const roleMapping = {
    delegate: 'Chuyển xử lý',
    return: 'Trả lại',
    completed: 'Hoàn thành xử lý',
    recall: 'Thu hồi',
};

const DocumentProcessPage = ({ isOpen, onClose, documentIds, mode, document }) => {
    const { user } = useAuth();
    const { users, fetchUsers } = useUsers();
    const {
        processDocuments,
        returnDocuments,
        markAsComplete,
        recallDocuments,
        fetchDocumentById,
    } = useDocuments();

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userRoles, setUserRoles] = useState({});
    const [note, setNote] = useState('');
    const [deadline, setDeadline] = useState('');
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTitle(roleMapping[mode] || 'Thao tác văn bản');
    }, [mode]);

    useEffect(() => {
        if (isOpen && user && mode === 'delegate') {

            const transferableRoles = roleHierarchy[user.role.name] || [];
            fetchUsers('', '', transferableRoles, '', '');
            const assignments = document?.document?.currentAssignments;

            if (Array.isArray(assignments)) {
                const preSelectedAll = [];
                const preRolesAll = {};

                assignments.forEach(assign => {
                    if (assign.userId) {
                        preSelectedAll.push({
                            _id: assign.userId._id,
                            name: assign.userId.name,
                            role: assign.userId.role
                        });
                        preRolesAll[assign.userId._id] = assign.role;
                    }
                });

                setUserRoles(preRolesAll);
                setSelectedUsers([]);

                console.log('68 DocumentProcessPage: assignments', preSelectedAll);
                console.log('69 DocumentProcessPage: User roles', preRolesAll);
            }
        }
    }, [isOpen, user, mode, document, fetchUsers]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedUsers([]);
            setUserRoles({});
            setNote('');
            setDeadline('');
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelectUser = (userToSelect, role) => {
        let newRoles = { ...userRoles };
        let newSelectedUsers = [...selectedUsers];

        // Nếu người này đã có -> chỉ đổi vai trò
        if (newSelectedUsers.find(u => u._id === userToSelect._id)) {
            newRoles[userToSelect._id] = role;
        } else {
            // Nếu là mainProcessor thì đảm bảo chỉ 1 người có
            if (role === 'mainProcessor') {
                Object.keys(newRoles).forEach((userId) => {
                    if (newRoles[userId] === 'mainProcessor') {
                        delete newRoles[userId];
                    }
                });
                newSelectedUsers = newSelectedUsers.filter(u => newRoles[u._id]);
            }

            newSelectedUsers.push(userToSelect);
            newRoles[userToSelect._id] = role;
        }

        setUserRoles(newRoles);
        setSelectedUsers(newSelectedUsers);
    };

    const handleRemoveUser = (userId) => {
        const newSelectedUsers = selectedUsers.filter(user => user._id !== userId);
        const newRoles = { ...userRoles };
        delete newRoles[userId];

        setSelectedUsers(newSelectedUsers);
        setUserRoles(newRoles);
    };

    const handleAction = async () => {
        const finalDocumentIds = Array.isArray(documentIds) ? documentIds : [documentIds];
        switch (mode) {
            case 'delegate':
                {
                if (selectedUsers.length === 0) {
                    toast.warn("Vui lòng chọn ít nhất một người để chuyển xử lý.");
                    return;
                }
                const delegatedProcessors = selectedUsers.map(u => ({
                    userId: u._id,
                    role: userRoles[u._id],
                    status: 'processing',
                    deadline
                })).filter(p => p.role);

                if (delegatedProcessors.length === 0) {
                    toast.warn("Vui lòng chọn ít nhất một vai trò cho người được chuyển.");
                    return;
                }

                await processDocuments(finalDocumentIds, delegatedProcessors, note, deadline);
                break;
            }
            case 'return':
                await returnDocuments(finalDocumentIds, note);
                break;
            case 'recall':
                await recallDocuments(finalDocumentIds);
                break;
            case 'completed':
                await markAsComplete(finalDocumentIds);
                break;
            default:
                console.error("Chế độ không hợp lệ.");
                return;
        }

        // Sau khi thao tác thành công, refetch chi tiết để cập nhật lịch sử xử lý ngay
        try {
            const firstId = finalDocumentIds[0];
            if (firstId && typeof fetchDocumentById === 'function') {
                await fetchDocumentById(firstId);
            }
        } catch (e) {
            console.error('Không thể cập nhật lại chi tiết văn bản sau khi thao tác.', e);
        }

        onClose();
    };

    const renderContent = () => {
        // ... (phần UI không thay đổi)
        switch (mode) {
            case 'delegate':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-300 rounded-lg">
                        <div className="p-2 border-r border-gray-300">
                            <h4 className="text-sm font-medium mb-2">Danh sách đơn vị, cá nhân</h4>
                            <div className="mb-2 h-8 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center text-xs">
                                <select className="w-full md:w-auto p-2 border border-gray-300 rounded-md">
                                    <option>Khoa/đơn vị</option>
                                </select>
                                <div className="relative w-full">
                                    <input type="text" placeholder="Tìm kiếm đơn vị, cá nhân..." className="p-2 pl-10 border border-gray-300 rounded-md w-full" />
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.61l3.582 3.583a1 1 0 01-1.415 1.414l-3.582-3.583A6 6 0 012 8z" clipRule="evenodd" /></svg>
                                </div>
                            </div>
                            <div className="overflow-x-auto overflow-y-auto h-96">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 min-w-[150px] text-left text-xs font-medium text-gray-500 tracking-wider">Tên đơn vị, cá nhân</th>
                                            <th className="px-6 py-3 min-w-[150px] text-center text-xs font-medium text-gray-500 tracking-wider">Chọn đọc/xử lý</th>
                                            <th className="px-6 py-3 min-w-[160px] text-center text-xs font-medium text-gray-500 tracking-wider">Phối hợp</th>
                                            <th className="px-6 py-3 min-w-[150px] text-center text-xs font-medium text-gray-500 tracking-wider">Nhận để biết</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map(user => (
                                            <tr key={user._id}>
                                                <td className="px-6 whitespace-nowrap text-xs text-gray-900">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-blue-600">
                                                            {user.name}
                                                            {(user.role?.description || user.role?.name) && (
                                                                <span className="ml-1 text-red-500 font-normal text-[11px]">- {user.role?.description || user.role?.name}</span>
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{user.unit}</span>
                                                    </div>
                                                </td>
                                                {['mainProcessor', 'collaborator', 'inform'].map(role => {
                                                    const isAssignedRole = userRoles[user._id] === role;
                                                    const hasMainProcessor = Object.values(userRoles).includes('mainProcessor');
                                                    return (
                                                        <td
                                                            key={role}
                                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                                                                checked={isAssignedRole}
                                                                disabled={
                                                                    role === 'mainProcessor'
                                                                        ? (userRoles[user._id] === 'mainProcessor' || (hasMainProcessor && userRoles[user._id] !== 'mainProcessor'))
                                                                        : false 
                                                                }
                                                                onChange={() => handleSelectUser(user, role)}
                                                            />
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='p-2'>
                            <h4 className="text-sm font-medium mb-2">Danh sách đơn vị cá nhân được phân xử lý</h4>
                            <div className="overflow-x-auto overflow-y-auto h-58">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">STT</th>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Tên người nhận</th>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Vai trò</th>
                                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Bỏ chọn</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedUsers.map((user, index) => (
                                            <tr key={user._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-center font-medium text-gray-900">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                                    {userRoles[user._id] === 'mainProcessor' ? 'Xử lý chính' :
                                                        userRoles[user._id] === 'collaborator' ? 'Phối hợp' : 'Nhận để biết'}
                                                </td>
                                                <td className="px-6 py-2 whitespace-nowrap text-xs text-center">
                                                    <div className="flex justify-center items-center h-5 w-5">
                                                        {(userRoles[user._id] !== 'mainProcessor') ? (
                                                            <button
                                                                onClick={() => handleRemoveUser(user._id)}
                                                                className="text-red-600 hover:text-red-900 h-5 w-5 flex items-center justify-center"
                                                            >
                                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        ) : (
                                                            <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-medium text-gray-700">Nhập nội dung, ý kiến khác</label>
                                <textarea
                                    rows="3"
                                    className="text-xs mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mt-2 flex items-center">
                                <label className="block text-xs font-medium text-gray-700 w-1/4">Hạn xử lý</label>
                                <input
                                    type="date"
                                    className="text-x mt-1 block w-3/4 p-2 border border-gray-300 rounded-md shadow-sm"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                />
                            </div>
                            <div className="mt-2 flex justify-end space-x-4">
                                <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                                    Hủy
                                </button>
                                <button onClick={handleAction} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-tl from-sky-300 to-sky-500 border border-sky-300 rounded-lg shadow-sm hover:bg-sky-600" disabled={isLoading}>
                                    {isLoading ? 'Đang xử lý...' : title}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'return':
            case 'recall':
            case 'completed':
                return (
                    <div className='p-2'>
                        <h4 className="text-sm font-medium mb-2">Thông tin xử lý</h4>
                        {mode === 'return' && (
                            <div className="mt-4">
                                <label className="block text-xs font-medium text-gray-700">Ý kiến trả lại</label>
                                <textarea
                                    rows="3"
                                    className="text-xs mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Nhập lý do trả lại văn bản..."
                                ></textarea>
                            </div>
                        )}
                        {mode === 'recall' && (
                            <p className="text-sm text-gray-700">Bạn có chắc chắn muốn thu hồi văn bản này?</p>
                        )}
                        {mode === 'completed' && (
                            <p className="text-sm text-gray-700">Bạn có chắc chắn muốn đánh dấu văn bản này đã hoàn thành?</p>
                        )}
                        <div className="mt-4 flex justify-end space-x-4">
                            <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                                Hủy
                            </button>
                            <button onClick={handleAction} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-tl from-sky-300 to-sky-500 border border-sky-300 rounded-lg shadow-sm hover:bg-sky-600" disabled={isLoading}>
                                {isLoading ? 'Đang xử lý...' : title}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 overflow-y-auto z-50">
            <div className="relative w-[95%] h-[85%] max-h-[95vh] overflow-y-auto rounded-md shadow-lg bg-white p-4 pt-2 pb-4 border border-gray-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default DocumentProcessPage;