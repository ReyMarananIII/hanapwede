import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";

export default function EmployeeSignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.user_type !== "Employee") {
          setError("Invalid role. Please sign in using a Job Seeker Account.");
          return;
        }
  
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userType", data.user_type);
  
        // Check if the employee has preferences set
        const preferencesResponse = await fetch(`http://127.0.0.1:8000/api/user-preferences/${data.userId}/`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${data.token}`
          },
        });
  
        const preferencesData = await preferencesResponse.json();
        console.log(preferencesData)
  
        if (preferencesData.has_preferences) {
          navigate("/job-seeker/dashboard");  // Redirect to dashboard
        } else {
          navigate("/job-seeker/preferences");  // Redirect to preferences setup
        }
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="bg-[#F8FBFF]">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#F8FBFF]">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Job Seeker Sign In</h1>
            <p className="text-sm text-muted-foreground">Sign in to apply for jobs and track applications</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="relative space-y-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 rounded-md">
              Sign In
            </button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/job-seeker/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
