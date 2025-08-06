import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

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