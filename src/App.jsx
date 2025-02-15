import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import EmployeeSignUpPage from "./EmployeeSignUpPage"
import EmployerSignUpPage from "./EmployerSignUpPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/job-seeker/login" element={<EmployeeSignUpPage />} />
        <Route path="/employer/login" element={<EmployerSignUpPage />} />


        {/* Add other routes here */}
      </Routes>
    </Router>
  )
}

export default App

