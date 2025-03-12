
import { useState, useEffect } from "react"
import LoggedInHeader from "./LoggedInHeader"
import Header from "./Header"
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Award, Edit, Loader, AlertCircle } from "lucide-react"

export default function EmployeeProfile() {
  const [userDetails, setUserDetails] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
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
      })
      .catch((error) => {
        console.error("Error fetching user details:", error)
        setError("Failed to load user profile. Please try again.")
        setIsLoading(false)
      })
  }, [userId]) // Added dependency array to prevent infinite calls

  if (isLoading) {
    return (
      <div>
        {isLoggedIn ? <LoggedInHeader /> : <Header />}
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="flex flex-col items-center">
            <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
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
    <div>
      {isLoggedIn ? <LoggedInHeader /> : <Header />}

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-blue-600 h-32 relative z-10">
              {isLoggedIn && (
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Edit className="w-5 h-5 text-blue-600" />
                </button>
              )}
            </div>

            <div className="px-6 pb-6 relative">
              <div className="absolute -top-16 left-6">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-md">
                  {userDetails.profile_image ? (
                    <img
                      src={userDetails.profile_image || "/placeholder.svg"}
                      alt={userDetails.full_name || userDetails.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-16 h-16 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-20">
                <h1 className="text-2xl font-bold">{userDetails.full_name || userDetails.username}</h1>
                <p className="text-gray-600">{userDetails.job_title || "Employee"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

              <div className="space-y-4">
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
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{userDetails.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{userDetails.location || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date Joined</p>
                    <p>
                      {userDetails.date_joined
                        ? new Date(userDetails.date_joined).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Employment</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p>{userDetails.department || "Not assigned"}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Award className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p>{userDetails.position || "Not specified"}</p>
                  </div>
                </div>

                {userDetails.employee_id && (
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Employee ID</p>
                      <p>{userDetails.employee_id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills & Bio */}
            {(userDetails.skills || userDetails.bio) && (
              <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
                {userDetails.bio && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">About</h2>
                    <p className="text-gray-700">{userDetails.bio}</p>
                  </div>
                )}

                {userDetails.skills && userDetails.skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {userDetails.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

