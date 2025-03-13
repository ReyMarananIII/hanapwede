import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import PwdCardOCR from "./PWDCardOCR";
import { useEffect } from "react";
export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_disability: "",
    ID_number: "",
  });


  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  useEffect(() => {console.log(formData);}, [formData]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!formData.user_disability || !formData.ID_number) {
      setError("Please upload your PWD card to fill in the required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      console.log("FORM DATA BEFORE SENDING", formData);
      const response = await fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
          user_type: "Employee",
          user_disability: formData.user_disability,
          ID_number: formData.ID_number
        }),
      });

      const data = await response.json();

      if (response.ok) {
    
        setSuccess("Registration Successful. Account pending approval.");
        alert(success);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          user_disability: formData.user_disability, 
          ID_number: formData.ID_number
        });
      } else {
        setError(data.error || "Signup failed.");
      
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
            <h1 className="text-2xl font-semibold tracking-tight">Job Seeker Sign Up</h1>
            <p className="text-sm text-muted-foreground">Create an account to apply for jobs and track applications</p>


          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
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
            </div>
            <div className="relative space-y-2">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
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
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <PwdCardOCR formData={formData} setFormData={setFormData} />
            <button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 rounded-md">
              Sign Up
            </button>

         
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/job-seeker/signin" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
