"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Swal from "sweetalert2"
import { baseURL } from "./constants"
import { Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle, XCircle } from "lucide-react"

const ResetPassword = () => {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "Too weak",
    color: "text-red-500",
  })

  // Check password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, message: "Too weak", color: "text-red-500" })
      return
    }

    let score = 0
    if (newPassword.length >= 8) score += 1
    if (/[A-Z]/.test(newPassword)) score += 1
    if (/[a-z]/.test(newPassword)) score += 1
    if (/[0-9]/.test(newPassword)) score += 1
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1

    const strengthMap = {
      0: { message: "Too weak", color: "text-red-500" },
      1: { message: "Weak", color: "text-red-500" },
      2: { message: "Fair", color: "text-yellow-500" },
      3: { message: "Good", color: "text-yellow-500" },
      4: { message: "Strong", color: "text-green-500" },
      5: { message: "Very strong", color: "text-green-500" },
    }

    setPasswordStrength({ score, ...strengthMap[score] })
  }, [newPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password is required!",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please make sure your passwords match.",
      })
      return
    }

    if (passwordStrength.score < 3) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Please choose a stronger password for better security.",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${baseURL}/api/reset-password/${uid}/${token}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_password: newPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error || "Something went wrong!",
        })
      } else {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your password has been successfully reset.",
          confirmButtonColor: "#4CAF50",
        }).then(() => {
          navigate("/")
        })
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred. Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStrengthBarWidth = () => {
    return `${(passwordStrength.score / 5) * 100}%`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Create a new secure password for your account</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your new password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.message}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        passwordStrength.score <= 1
                          ? "bg-red-500"
                          : passwordStrength.score <= 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: getStrengthBarWidth() }}
                    ></div>
                  </div>
                  <ul className="mt-2 text-xs text-gray-500 space-y-1">
                    <li className="flex items-center">
                      {newPassword.length >= 8 ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      {/[A-Z]/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      {/[0-9]/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      At least one number
                    </li>
                    <li className="flex items-center">
                      {/[^A-Za-z0-9]/.test(newPassword) ? (
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    confirmPassword && newPassword !== confirmPassword
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  } rounded-md focus:outline-none`}
                  placeholder="Confirm your new password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || newPassword !== confirmPassword}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading || newPassword !== confirmPassword
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Remember your password?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
