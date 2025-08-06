import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import userService from '../services/userService';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sử dụng useCallback để memoize hàm fetchUsers, tránh re-render không cần thiết
    const fetchUsers = useCallback(async (
            query = '',
            departmentID = '', 
            role = '', 
            gender = '', 
            isLocked = ''
        ) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedUsers = await userService.getAllUsers(query, departmentID, role, gender, isLocked);
            setUsers(fetchedUsers);
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // 3. Gọi hàm fetchUsers khi component mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // 4. Giá trị cung cấp cho các component con
    const value = {
        users,
        loading,
        error,
        fetchUsers
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};