import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import LoginPage from "./pages/Auth/LoginPage";

import UserCreatePage from "./pages/Users/UserCreatePage";
import UserDetailPage from "./pages/Users/UserDetailPage";
import UserListPage from "./pages/Users/UserListPage";

import DocumentListPage from "./pages/Document/DocumentListPage"
import DocumentDetailPage from "./pages/Document/DocumentDetailPage"
import DocumentCreatePage from "./pages/Document/DocumentCreatePage"
import DocumentProcessPage from "./pages/Document/DocumentProcessPage"

import Profile from "./pages/ProfilePage"
import NotFoundPage from "./pages/NotFoundPage"

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/*Public Routes */}
          <Route path="/login" element={<LoginPage/>} />
          
          {/*Protect Routes */}
            {/* User Management Routes */}
            <Route path="/users" element={<UserListPage/>} />
            <Route path="/users/create" element={<UserCreatePage/>} />
            <Route path="/users/:id" element={<UserDetailPage/>} />

            {/* Document Management Routes */}
            <Route path="/documents" element={<DocumentListPage/>} />
            <Route path="/documents/create" element={<DocumentCreatePage/>} />
            <Route path="/documents/:id" element={<DocumentDetailPage/>} />
            <Route path="/documents/:id/process" element={<DocumentProcessPage/>} />

            {/* Profile Page */}
            <Route path="/profile" element={<Profile/>} />  

            {/* Catch All Route for authenticated users */}
            <Route path="*" element={<NotFoundPage />} />
            {/* <Route path="*" element={<Navigate to="/login" replace />}/> */}
        </Routes>
      </Router>


      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  )
}

export default App