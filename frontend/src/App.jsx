import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastCustom.css';

import LoginPage from "./pages/Auth/LoginPage";

import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { DocumentProvider } from "./context/DocumentsContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import DynamicRouter from "./routes/DynamicRouter";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <UserProvider>
          <DocumentProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="*" element={<MainLayout><DynamicRouter /></MainLayout>} />
                  </Route>
              </Routes>
            </Router>
          </DocumentProvider>
        </UserProvider>
        
      </AuthProvider>
      
      {/* React Toastify Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
      />
    </div>
  )
}

export default App