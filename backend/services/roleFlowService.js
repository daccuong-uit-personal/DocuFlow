const { roleHierarchy } = require('../config/roleFlow');

exports.canDelegate = (assignerRole, assigneeRole) => {
    const allowedRoles = roleHierarchy[assignerRole];

    if (allowedRoles && allowedRoles.includes(assigneeRole)) {
        return true;
    }

    return false;
};

// Lấy tất cả các role cấp dưới (đệ quy)
exports.getAllLowerRoles = (roleName) => {
    let result = [];
    if (roleHierarchy[roleName]) {
        for (const lowerRole of roleHierarchy[roleName]) {
            result.push(lowerRole);
            result = result.concat(exports.getAllLowerRoles(lowerRole));
        }
    }
    return result;
};