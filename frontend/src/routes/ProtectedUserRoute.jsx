import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const ProtectedUserRoute = ({ children }) => {
  const { isAdmin, user } = usePermissions();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    if (user && !isAdmin() && !hasShownToast) {
      toast.error('Bạn không có quyền truy cập trang này!');
      setHasShownToast(true);
    }
  }, [user, isAdmin, hasShownToast]);

  // Nếu chưa load user thì hiển thị loading
  if (!user) {
    return <div>Đang tải...</div>;
  }

  // Nếu không phải admin thì redirect về trang chủ
  if (!isAdmin()) {
    return <Navigate to="/documents" replace />;
  }

  // Nếu là admin thì cho phép truy cập
  return children;
};

export default ProtectedUserRoute;
