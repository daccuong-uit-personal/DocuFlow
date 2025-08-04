import DocumentListPage from "../pages/Document/DocumentListPage";
import DocumentCreatePage from "../pages/Document/DocumentCreatePage";
import DocumentDetailPage from "../pages/Document/DocumentDetailPage";
import DocumentProcessPage from "../pages/Document/DocumentProcessPage";
import UserListPage from "../pages/Users/UserListPage";
import UserDetailPage from "../pages/Users/UserDetailPage";
import UserCreatePage from "../pages/Users/UserCreatePage";
import ProfilePage from "../pages/ProfilePage";
import { Route, Routes } from "react-router-dom";

const DynamicRouter = () => {
  return (
    <Routes>
      <Route path="/documents" element={<DocumentListPage />} />
      <Route path="/documents/create" element={<DocumentCreatePage />} />
      <Route path="/documents/detail" element={<DocumentDetailPage />} />
      <Route path="/documents/process" element={<DocumentProcessPage />} />
      <Route path="/users" element={<UserListPage />} />
      <Route path="/users/detail" element={<UserDetailPage />} />
      <Route path="/users/create" element={<UserCreatePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      {/* Thêm các route khác vào đây */}
      <Route path="*" element={<div className="p-8 text-center text-gray-500">404 - Không tìm thấy trang.</div>} />
    </Routes>
  );
}
export default DynamicRouter;