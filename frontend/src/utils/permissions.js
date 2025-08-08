// Các hàm cho việc kiểm tra quyền

export const ROLES = {
    ADMIN: 'admin',
    GIAM_DOC: 'giam_doc',
    TRUONG_PHONG: 'truong_phong',
    PHO_PHONG: 'pho_phong',
    NHAN_VIEN: 'nhan_vien',
};

export const PERMISSIONS = {
    // User permissions
    USER_READ: 'user:read',
    USER_CREATE: 'user:create',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
    USER_TRANSFER: 'user:transfer',

    // Document permissions
    DOCUMENT_READ: 'document:read',
    DOCUMENT_CREATE: 'document:create',
    DOCUMENT_UPDATE: 'document:update',
    DOCUMENT_DELETE: 'document:delete',
    DOCUMENT_PROCESS: 'document:process',

    // Department permissions
    DEPARTMENT_READ: 'department:read',
    DEPARTMENT_CREATE: 'department:create',
    DEPARTMENT_UPDATE: 'department:update',
    DEPARTMENT_DELETE: 'department:delete',

    // Role permissions
    ROLE_READ: 'role:read',
    ROLE_CREATE: 'role:create',
    ROLE_UPDATE: 'role:update',
    ROLE_DELETE: 'role:delete',
};

export const checkRole = (user, roleName) => {
    if (!user || !user.role) return false;
    return user.role.name === roleName;
};

export const checkPermission = (user, permissionName) => {
    if (!user || !user.role || !user.role.permissions) return false;
    return user.role.permissions.some(permission =>
        permission.name === permissionName || permission === permissionName
    );
};

export const isAdmin = (user) => {
    return checkRole(user, ROLES.ADMIN);
};