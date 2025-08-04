const roleHierarchy = require('../config/roleFlow');

exports.canDelegate = (assignerRole, assigneeRole) => {
    const allowedRoles = roleHierarchy[assignerRole];

    if (allowedRoles && allowedRoles.includes(assigneeRole)) {
        return true;
    }

    return false;
};