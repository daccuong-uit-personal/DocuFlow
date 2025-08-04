import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import LoginPage from "./pages/Auth/LoginPage";

// import UserCreatePage from "./pages/Users/UserCreatePage";
// import UserDetailPage from "./pages/Users/UserDetailPage";
// import UserListPage from "./pages/Users/UserListPage";

import DocumentListPage from "./pages/Document/DocumentListPage";
// import DocumentDetailPage from "./pages/Document/DocumentDetailPage";
// import DocumentCreatePage from "./pages/Document/DocumentCreatePage";
// import DocumentProcessPage from "./pages/Document/DocumentProcessPage";

// import Profile from "./pages/ProfilePage";
// import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/MainLayout";
import DynamicRouter from "./routes/DynamicRouter";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="*" element={<MainLayout><DynamicRouter /></MainLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
      
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