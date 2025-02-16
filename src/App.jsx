import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRouted";
import EmployeeSignUpPage from "./EmployeeSignUpPage";
import EmployerSignUpPage from "./EmployerSignUpPage";
import EmployeeSignIn from "./EmployeeSignInPage";
import EmployerSignIn from "./EmployerSignInPage";
import LandingPage from "./LandingPage";
import EmployeeDashboard from "./EmployeeDashboard";
import EmployerProfile from "./EmployerProfile";
import Unauthorized from "./Unauthorized"; 
import NotFound from "./NotFound";
import EditProfile from "./EditProfile"; 
import PostJobForm from "./PostJobForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/job-seeker/signin" element={<EmployeeSignIn />} />
        <Route path="/employer/signin" element={<EmployerSignIn />} />
        <Route path="/job-seeker/signup" element={<EmployeeSignUpPage />} />
        <Route path="/employer/signup" element={<EmployerSignUpPage />} />
        <Route path="/" element={<LandingPage />} />

        {/* Employee Routes */}
        <Route 
          path="/job-seeker/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeDashboard />
              
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/job-seeker/profile" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EditProfile />
              
            </ProtectedRoute>
          } 
        />

        {/* Employer Routes */}
        <Route 
          path="/employer/profile" 
          element={
            <ProtectedRoute allowedRoles={["Employer"]}>
              <EmployerProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employer/post-job" 
          element={
            <ProtectedRoute allowedRoles={["Employer"]}>
              <PostJobForm />
            </ProtectedRoute>
          } 
        />


        <Route path="/unauthorized" element={<Unauthorized />} />

      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
