// Hook để kiểm tra quyền hạn của người dùng
import { useAuth } from './useAuth';

export const usePermissions = () => {
    const { user } = useAuth();

    // Kiểm tra xem user có role cụ thể không
    const hasRole = (roleName) => {
        if (!user || !user.role) return false;
        return user.role.name === roleName;
    };

    // Kiểm tra xem user có một trong các roles không
    const hasAnyRole = (roleNames) => {
        if (!user || !user.role) return false;
        return roleNames.includes(user.role.name);
    };

    // Kiểm tra xem user có permission cụ thể không
    const hasPermission = (permissionName) => {
        if (!user || !user.role || !user.role.permissions) return false;
        return user.role.permissions.some(permission =>
            permission.name === permissionName || permission === permissionName
        );
    };

    // Kiểm tra xem user có một trong các permissions không
    const hasAnyPermission = (permissionNames) => {
        if (!user || !user.role || !user.role.permissions) return false;
        return permissionNames.some(permissionName =>
            user.role.permissions.some(permission =>
                permission.name === permissionName || permission === permissionName
            )
        );
    };

    // Kiểm tra xem user có phải admin không
    const isAdmin = () => {
        return hasRole('admin');
    };

    // Kiểm tra xem user có quyền quản lý người dùng không
    const canManageUsers = () => {
        return isAdmin() || hasAnyPermission(['user:read', 'user:create', 'user:update', 'user:delete']);
    };

    // Kiểm tra xem user có quyền xem danh sách người dùng không
    const canViewUsers = () => {
        return isAdmin() || hasPermission('user:read');
    };

    return {
        user,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        isAdmin,
        canManageUsers,
        canViewUsers,
    };
};