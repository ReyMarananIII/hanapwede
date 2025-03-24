"use client"

import { useState, useEffect } from "react"
import LoggedInHeader from "./LoggedInHeader"
import Header from "./Header"
import {
  User,
  Eye,
  Briefcase,
  Edit,
  MapPin,
  Accessibility,
  Mail,
  Phone,
  Award,
  Brain,
  Loader,
  AlertCircle,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function EmployeeProfile() {
  const [userDetails, setUserDetails] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("about")
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoading(true)
    setError(null)

    fetch(`http://localhost:8000/api/get-user-details/${userId}/`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user details")
        }
        return res.json()
      })
      .then((data) => {
        setUserDetails(data)
        setIsLoading(false)
        console.log(data.profile)
      })
      .catch((error) => {
        console.error("Error fetching user details:", error)
        setError("Failed to load user profile. Please try again.")
        setIsLoading(false)
      })
  }, [userId])

  const tabs = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "announcements", label: "Announcements" },
  ]

  if (isLoading) {
    return (
      <div>
        {isLoggedIn ? <LoggedInHeader /> : <Header />}
        <div className="flex items-center justify-center min-h-screen bg-[#F8FBFF]">
          <div className="flex flex-col items-center">
            <Loader className="w-10 h-10 text-[#4CAF50] animate-spin mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        {isLoggedIn ? <LoggedInHeader /> : <Header />}
        <div className="flex items-center justify-center min-h-screen bg-[#F8FBFF]">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 text-center">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div>
        {isLoggedIn ? <LoggedInHeader /> : <Header />}
        <div className="flex items-center justify-center min-h-screen bg-[#F8FBFF]">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="flex items-center justify-center text-gray-400 mb-4">
              <User className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">User Not Found</h2>
            <p className="text-gray-600 text-center">The requested user profile could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {isLoggedIn ? <LoggedInHeader /> : <Header />}

      {/* Profile Header with gradient banner */}
      <div className="h-40 bg-gradient-to-r from-[#4CAF50] to-[#00BCD4]" />

      <div className="container mx-auto px-4 -mt-20">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-end gap-4">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white">
              {userDetails.profile_image ? (
                <img
                  src={userDetails.profile_image || "/placeholder.svg"}
                  alt={userDetails.full_name || userDetails.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                {userDetails.full_name || userDetails.username}
              </h1>
              <p className="text-white opacity-90">{userDetails.profile?.pro_headline || "Job Seeker"}</p>
            </div>
          </div>

          {isLoggedIn && (
            <Link
              to="/job-seeker/edit-profile"
              className="mt-4 px-4 py-2 bg-white text-[#4CAF50] border border-[#4CAF50] rounded-md shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Edit Profile
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-6 border-b mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 px-1 ${
                    activeTab === tab.id ? "border-b-2 border-[#4CAF50] text-[#4CAF50]" : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p>{userDetails.profile?.full_name || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p>{userDetails.profile?.location || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Accessibility className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Disability Type</p>
                        <p>{userDetails.profile?.user_disability || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p>{userDetails.email || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Contact Number</p>
                        <p>{userDetails.profile?.contact_no || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {userDetails.profile?.bio && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">About Me</h2>
                    <p className="text-gray-700">{userDetails.profile.bio}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Professional Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p>{userDetails.profile?.role || "Not assigned"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p>{userDetails.profile?.experience || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Skills</h2>
                  <div className="flex items-start">
                    <Brain className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {userDetails.profile?.skills ? (
                          userDetails.profile.skills.split(",").map((skill, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                              {skill.trim()}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "announcements" && (
              <div className="text-gray-500 italic">No announcements at this time.</div>
            )}
          </div>

          {/* Quick Stats Sidebar */}
   
        </div>
      </div>
    </div>
  )
}

