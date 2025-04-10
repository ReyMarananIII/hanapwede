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
import AdminReportsPage from "./AdminReportsPage";
import AdminUserApprovalPage from "./AdminUserApprovalPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import AdminLoginPage from "./AdminLoginPage";
import EditJob from "./EditJob";
import NotificationsPage from "./NotificationsPage";
import AccessibilityPage from "./AccessibilityPage";
import ApplicationTracker from "./ApplicationTracker";
import JobFairApplications from "./JobFairApplications";
import JobFairMain from "./JobFairMain";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ManageEmployers from "./ManageEmployers";
import ComponentWrapper from "./ComponentWrapper";
import EmployerComponentWrapper from "./EmployerComponentWrapper";
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
        <Route path="/admin/signin" element={<AdminLoginPage />} />
        <Route path="job-seeker/profile/:userId" element={<EmployeeProfile />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/job-fairs" element={<JobFairMain />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword/>} />


     


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

<Route 
        path="admin/manage-employers"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <ManageEmployers />
              
            </ProtectedRoute>
          } 
        />

<Route 
        path="admin/manage-reports"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminReportsPage />
              
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
  path="/employee-components"
  element={
    <ProtectedRoute allowedRoles={["Employee"]}>
      <ComponentWrapper
        top1={<EmployeeProfile />}
        top2={<EmployeeDashboard />}
        top3={<JobFairMain />}
        bottom={<ForumPage />}
      />
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

<Route 
          path="/job-seeker/track-job" 
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <ApplicationTracker />
              
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
          path="/job-fairs/:jobFairId/applications"
          element={
            <ProtectedRoute allowedRoles={["Employer"]}>
              <JobFairApplications />
            </ProtectedRoute>
          } 
        />

<Route 
  path="/employer-components"
  element={
    <ProtectedRoute allowedRoles={["Employer"]}>
      <EmployerComponentWrapper
        top1={<EmployerProfile />}
        top2={<EmployerDashboard />}
        top3={<JobFairMain />}
        bottom={<ForumPage />}
      />
    </ProtectedRoute>
  }
/>


<Route 
          path="/employer/edit-job/:jobId" 
          element={
            <ProtectedRoute allowedRoles={["Employer"]}>
              <EditJob />
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
        className="fixed bottom-22 right-5 bg-[#7cd1ed] text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        🗣️
      </button>

      {/* Show TTS when button is clicked */}
      {isOpen && (
        <div className="fixed bottom-36 right-5 bg-white p-4 rounded-lg shadow-md">
          <TextToSpeech />
        </div>
      )}
    </Router>
  );
}

export default App;
