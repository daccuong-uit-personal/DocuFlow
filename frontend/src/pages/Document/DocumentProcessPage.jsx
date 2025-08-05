// Trang chuyển xử lý văn bản

import React, { useState } from 'react';

// Giả lập dữ liệu cho danh sách người dùng
const mockUserData = [
    { id: 1, name: 'Nguyễn Quốc Tuấn - GIÁM ĐỐC', position: 'Giám đốc', unit: 'Văn phòng Bộ Công an - V01' },
    { id: 2, name: 'Phó giám đốc 01 - PHÓ GIÁM ĐỐC', position: 'Phó giám đốc', unit: 'Văn phòng Bộ Công an - V01' },
    { id: 3, name: 'Phó giám đốc 02 - PHÓ GIÁM ĐỐC', position: 'Phó giám đốc', unit: 'Văn phòng Bộ Công an - V01' },
    { id: 4, name: 'hoangminhtuyen', position: 'Chuyên viên', unit: 'Văn phòng Bộ Công an - V01' },
    { id: 5, name: 'nguyenhongnguyen', position: 'Chuyên viên', unit: 'Văn phòng Bộ Công an - V01' },
    { id: 6, name: 'nguyenhongnguyen1', position: 'Chuyên viên', unit: 'Văn phòng Bộ Công an - V01' },
    { id: 7, name: 'nguyenhongnguyen2', position: 'Chuyên viên', unit: 'Văn phòng Bộ Công an - V01' },
    { id: 8, name: 'nguyenhongnguyen3', position: 'Chuyên viên', unit: 'Văn phòng Bộ Công an - V01' },
];

const DocumentProcessPage = ({ isOpen, onClose }) => {
    // State để lưu danh sách người dùng được chọn
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    // State để lưu lựa chọn vai trò cho từng người dùng
    const [userRoles, setUserRoles] = useState({});
    
    // State cho nội dung, ý kiến khác
    const [note, setNote] = useState('');
    
    // State cho hạn xử lý
    const [deadline, setDeadline] = useState('');

    if (!isOpen) return null;

    // Hàm xử lý khi chọn/bỏ chọn người dùng
    const handleSelectUser = (user, role) => {
        const existingSelection = userRoles[user.id];
        
        // Nếu đã có lựa chọn, kiểm tra xem có phải cùng vai trò không
        if (existingSelection === role) {
            // Nếu cùng vai trò, bỏ chọn
            const newRoles = { ...userRoles };
            delete newRoles[user.id];
            setUserRoles(newRoles);
            setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
        } else {
            // Nếu chưa có hoặc khác vai trò, cập nhật vai trò mới
            const newRoles = { ...userRoles, [user.id]: role };
            setUserRoles(newRoles);
            
            // Thêm người dùng vào danh sách nếu chưa có
            if (!selectedUsers.find(u => u.id === user.id)) {
                setSelectedUsers([...selectedUsers, user]);
            }
        }
    };
    
    // Hàm xử lý khi bấm nút "Chuyển xử lý"
    const handleTransfer = () => {
        const transferData = {
            selectedUsers: selectedUsers.map(user => ({
                ...user,
                role: userRoles[user.id],
            })),
            note: note,
            deadline: deadline,
        };
        console.log('Dữ liệu chuyển xử lý:', transferData);
        // Sau này bạn sẽ gọi API ở đây
        onClose(); // Đóng modal sau khi xử lý
    };
    
    const handleRemoveUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
        const newRoles = { ...userRoles };
        delete newRoles[userId];
        setUserRoles(newRoles);
    };

    return (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 overflow-y-auto z-50">
              <div className="relative w-[95%] h-[85%] max-h-[95vh] overflow-y-auto rounded-md shadow-lg bg-white p-4 pt-2 pb-4 border border-gray-300">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Chuyển xử lý</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-300 rounded-lg ">
                    {/* Panel trái: Danh sách người dùng để chọn */}
                    <div className="p-2 border-r border-gray-300">
                        <h4 className="text-sm font-medium mb-2">Danh sách đơn vị, cá nhân</h4>
                        
                        {/* Thanh tìm kiếm và filter */}
                        <div className="mb-2 h-8 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 items-center text-xs">
                            <select className="w-full md:w-auto p-2 border border-gray-300 rounded-md">
                                <option>Khoa/đơn vị</option>
                            </select>
                            <div className="relative w-full">
                                <input type="text" placeholder="Tìm kiếm đơn vị, cá nhân..." className="p-2 pl-10 border border-gray-300 rounded-md w-full" />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.61l3.582 3.583a1 1 0 01-1.415 1.414l-3.582-3.583A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </div>
                        </div>

                        {/* Bảng danh sách người dùng có thể chọn */}
                        <div className="overflow-x-auto overflow-y-auto h-96">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 min-w-[150px] text-left text-xs font-medium text-gray-500 tracking-wider">Tên đơn vị, cá nhân</th>
                                        <th className="px-6 py-3 min-w-[150px] text-center text-xs font-medium text-gray-500 tracking-wider">Chọn người xử lý</th>
                                        <th className="px-6 py-3 min-w-[160px] text-center text-xs font-medium text-gray-500 tracking-wider">Phối hợp</th>
                                        <th className="px-6 py-3 min-w-[150px] text-center text-xs font-medium text-gray-500 tracking-wider">Nhận để biết</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {mockUserData.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 whitespace-nowrap text-xs text-gray-900">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-blue-600">{user.name}</span>
                                                    <span className="text-xs text-gray-500">{user.unit}</span>
                                                </div>
                                            </td>
                                            {['read', 'collaborate', 'inform'].map(role => (
                                                <td key={role} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                    <input 
                                                        type="checkbox"
                                                        className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                                                        checked={userRoles[user.id] === role}
                                                        onChange={() => handleSelectUser(user, role)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Panel phải: Danh sách đơn vị đã được chọn */}
                    <div className='p-2'>
                        <h4 className="text-sm font-medium mb-2">Danh sách đơn vị cá nhân được phân xử lý</h4>
                        <div className="overflow-x-auto overflow-y-auto h-58">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-2  text-left text-xs font-medium text-gray-500 tracking-wider">STT</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Tên người nhận</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Vai trò</th>
                                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">Bỏ chọn</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {selectedUsers.map((user, index) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-center font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                                {userRoles[user.id] === 'read' ? 'Chọn đọc/xử lý' : 
                                                 userRoles[user.id] === 'collaborate' ? 'Phối hợp' : 'Nhận để biết'}
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-xs text-center">
                                                <button onClick={() => handleRemoveUser(user.id)} className="text-red-600 hover:text-red-900">
                                                    <svg className="h-4 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                </button>
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
                            <button onClick={handleTransfer} className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-tl from-sky-300 to-sky-500 border border-sky-300 rounded-lg shadow-sm hover:bg-sky-600">
                                Chuyển xử lý
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentProcessPage;