import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRouted";
import EmployeeSignUpPage from "./EmployeeSignUpPage";
import EmployerSignUpPage from "./EmployerSignUpPage";
import EmployeeSignIn from "./EmployeeSignInPage";
import EmployerSignIn from "./EmployerSignInPage";
import LandingPage from "./LandingPage";
import EmployerProfile from "./EmployerProfile";
import { useState } from "react";
import EmployeeDashboard from "./EmployeeDashboard";
import EditEmployerProfile from "./EditEmployerProfile";
import Unauthorized from "./Unauthorized"; 
import NotFound from "./NotFound";
import EditProfile from "./EditProfile"; 
import PostJobForm from "./PostJobForm";
import EmployerDashboard from "./EmployerDashboard";
import Preferences from "./Preferences";
import TextToSpeech from "./TextToSpeech";
import JobApplication from "./JobApplication";
import ForumPage from "./ForumPage";
import ChatRoom from "./ChatRoom";
import UserChats from "./UserChats";
import EmployeeProfile from "./EmployeeProfile";
import FAQPage from "./FAQPage";
import PreferencesPage from "./PreferencesPage";
import PWDCardOCR from "./PWDCardOCR";
import AdminManageUsersPage from "./AdminManageUsersPage";
import AdminUserApprovalPage from "./AdminUserApprovalPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/job-seeker/signin" element={<EmployeeSignIn />} />
        <Route path="/employer/signin" element={<EmployerSignIn />} />
        <Route path="/job-seeker/signup" element={<EmployeeSignUpPage />} />
        <Route path="/employer/signup" element={<EmployerSignUpPage />} />
        <Route path="/hanapwede/forum" element={<ForumPage />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
        <Route path="/user-chats" element={<UserChats />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/FAQS" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
       

        <Route 
        path="admin/user-approval"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminUserApprovalPage />
              
            </ProtectedRoute>
          } 
        />
             <Route 
        path="admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminManageUsersPage />
              
            </ProtectedRoute>
          } 
        />



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
          path="/job-seeker/pwd" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <PWDCardOCR />
              
            </ProtectedRoute>
          } 
        />

<Route 
          path="/job-seeker/profile" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeProfile />
              
            </ProtectedRoute>
          } 
        />

<Route 
          path="/job-seeker/preferences" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <Preferences />
              
            </ProtectedRoute>
          } 
        />


<Route 
          path="/job-seeker/job-preferences" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <PreferencesPage />
              
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/job-seeker/apply/" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <JobApplication />
              
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/job-seeker/edit-profile" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EditProfile />
              
            </ProtectedRoute>
          } 
        />

        {/* Employer Routes */}
        <Route 
          path="/employer/edit-profile" 
          element={
            <ProtectedRoute allowedRoles={["Employer"]}>
              <EditEmployerProfile />
            </ProtectedRoute>
          } 
        />
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
         <Route 
          path="/employer/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["Employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          } 
        />



        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>


       <button
        className="fixed bottom-5 right-5 bg-[#7cd1ed] text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        🗣️
      </button>

      {/* Show TTS when button is clicked */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 bg-white p-4 rounded-lg shadow-md">
          <TextToSpeech />
        </div>
      )}
    </Router>
  );
}

export default App;
