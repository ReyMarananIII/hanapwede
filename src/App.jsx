import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import EmployeeSignUpPage from "./EmployeeSignUpPage"
import EmployerSignUpPage from "./EmployerSignUpPage"
import EmployeeSignIn from "./EmployeeSignInPage"
import EmployerSignIn from "./EmployerSignInPage"
import LandingPage from "./LandingPage"
import EmployeeDashboard from "./EmployeeDashboard"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/job-seeker/signin" element={<EmployeeSignIn />} />
        <Route path="/employer/signin" element={<EmployerSignIn />} />
        <Route path="/job-seeker/signup" element={<EmployeeSignUpPage />} />
        <Route path="/employer/signup" element={<EmployerSignUpPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/job-seeker/dashboard" element={<EmployeeDashboard />} />


        {/* Add other routes here */}
      </Routes>
    </Router>
  )
}

export default App

