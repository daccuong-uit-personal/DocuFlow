import { usePermissions } from '../../hooks/usePermissions';

const ProtectedComponent = ({ 
  children, 
  roles = [], 
  permissions = [], 
  requireAdmin = false,
  fallback = null 
}) => {
  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission, isAdmin } = usePermissions();

  // Nếu yêu cầu admin và user không phải admin
  if (requireAdmin && !isAdmin()) {
    return fallback;
  }

  // Nếu có yêu cầu roles và user không có role phù hợp
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return fallback;
  }

  // Nếu có yêu cầu permissions và user không có permission phù hợp
  if (permissions.length > 0 && !hasAnyPermission(permissions)) {
    return fallback;
  }

  // Nếu tất cả điều kiện đều thỏa mãn, hiển thị component
  return children;
};

export default ProtectedComponent;
