"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import EmployerJobFairs from "./EmployerJobFairs"
import JobSeekerJobFairs from "./JobSeekerJobFairs"
import { Loader } from "lucide-react"

export default function JobFairMain() {
  const [userType, setUserType] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in and get user type
    const authToken = localStorage.getItem("authToken")
    const userTypeFromStorage = localStorage.getItem("userType")

    if (!authToken) {
      navigate("/login")
      return
    }

    setUserType(userTypeFromStorage)
    setIsLoading(false)
  }, [navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
      <div className="container mx-auto px-4 py-8">
        {userType === "Employer" ? <EmployerJobFairs /> : <JobSeekerJobFairs />}
      </div>
    </div>
  )
}

