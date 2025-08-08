import DocumentListPage from "../pages/Document/DocumentListPage";
import DocumentCreatePage from "../pages/Document/DocumentCreatePage";
import DocumentDetailPage from "../pages/Document/DocumentDetailPage";
import DocumentEditPage from "../pages/Document/DocumentEditPage";
import DocumentProcessPage from "../pages/Document/DocumentProcessPage";
import UserListPage from "../pages/Users/UserListPage";
import UserDetailPage from "../pages/Users/UserDetailPage";
import UserCreatePage from "../pages/Users/UserCreatePage";
import UserEditPage from "../pages/Users/UserEditPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedUserRoute from "./ProtectedUserRoute";
import { Route, Routes } from "react-router-dom";

const DynamicRouter = () => {
  return (
    <Routes>
      {/* Routes công khai */}
      {/* Routes quản lý văn bản */}
      <Route path="/documents" element={<DocumentListPage />} />
      <Route path="/documents/create" element={<DocumentCreatePage />} />
      <Route path="/documents/detail/:id" element={<DocumentDetailPage />} />
      <Route path="/documents/edit/:id" element={<DocumentEditPage />} />

      {/* Routes xử lý văn bản */}
      <Route path="/documents/process" element={<DocumentProcessPage />} />

      {/* Routes cá nhân */}
      <Route path="/profile" element={<ProfilePage />} />

      {/* Routes chỉ dành cho admin */}
      <Route path="/users" element={
        <ProtectedUserRoute>
          <UserListPage />
        </ProtectedUserRoute>
      } />
      <Route path="/users/detail/:id" element={
        <ProtectedUserRoute>
          <UserDetailPage />
        </ProtectedUserRoute>
      } />
      <Route path="/users/create" element={
        <ProtectedUserRoute>
          <UserCreatePage />
        </ProtectedUserRoute>
      } />
      <Route path="/users/edit/:id" element={
        <ProtectedUserRoute>
          <UserEditPage />
        </ProtectedUserRoute>
      } />

      {/* 404 Page */}
      <Route path="*" element={<div className="p-8 text-center text-gray-500">404 - Không tìm thấy trang.</div>} />
    </Routes>
  );
}

export default DynamicRouter;