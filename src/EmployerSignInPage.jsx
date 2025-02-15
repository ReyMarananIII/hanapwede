import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "./Header"

export default function EmployerSignIn() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-[#F8FBFF]">
      <Header />
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#F8FBFF]">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Employer Sign In</h1>
            <p className="text-sm text-muted-foreground">Sign in to post jobs and manage applications</p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="relative space-y-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
           
            <button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white py-2 rounded-md">
              Sign In
            </button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/employer/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

