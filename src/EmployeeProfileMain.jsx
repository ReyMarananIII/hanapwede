"use client"
import LoggedInHeader from "./LoggedInHeader"
import { useState, useEffect } from "react"

import PreferencesPage from "./PreferencesPage"
import { useNavigate } from "react-router-dom"
import Header from "./Header"
import { baseURL } from './constants';
import Swal from "sweetalert2"
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
  Trash2,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function EmployeeProfile() {
    const handleError = (message) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
      });
    };
  
    const handleSuccess = (message) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message
      });
    }
  const [userDetails, setUserDetails] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("about")
  const userId = localStorage.getItem("userId")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [profilePicture,setProfilePicture] = useState(null)
  const navigate= useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoading(true)
    setError(null)

    fetch(`${baseURL}/api/get-user-details/${userId}/`, {
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
  }, [userId])


  useEffect(() => {
    const getProfilePicture = async () => {
      try {
        const response = await fetch(`${baseURL}/api/get-profile-picture/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile picture');
        }

        const data = await response.json();
        setProfilePicture(data.profile_picture);
      } catch (error) {
        setError(error.message); 
        console.error(error);
      }
    };

    getProfilePicture(); 

  }, [userDetails]);
  

  const tabs = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },

  ]

  const handleDeleteProfile = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${baseURL}/api/delete-account/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        // Clear local storage and redirect to home page
        localStorage.removeItem("authToken")
        localStorage.removeItem("userId")
        localStorage.removeItem("userType")
        localStorage.removeItem("username")
        navigate("/")
      } else {
        throw new Error("Failed to delete profile")
      }
    } catch (error) {
      console.error("Error deleting profile:", error)
      handleError("Failed to delete profile. Please try again.")
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

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

      <div className="container mx-auto px-2 sm:px-4 -mt-20">
      <div className="flex flex-col justify-between items-center mb-8">
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white">
            {userDetails.profile_image ? (
              <img
                src={userDetails.profile_image || "/placeholder.svg"}
                alt={userDetails.full_name || userDetails.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full rounded-full bg-gray-500 flex items-center justify-center"
                style={{
                  backgroundImage: `url(${profilePicture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!profilePicture && <User className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-400" />}
              </div>
            )}
          </div>
          <div className="text-center mt-1 sm:mt-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-1">
              {userDetails.profile?.full_name || userDetails.username}
            </h1>
            <p className="text-black-500 mb-3 sm:mb-6 font-bold opacity-90 text-sm sm:text-base">
              {userDetails.profile?.pro_headline || "Job Seeker"}
            </p>
          </div>
        </div>

        {isLoggedIn && (
          <div className="flex flex-wrap gap-2 mt-2 w-full justify-center">
 
            <Link
              to="/job-seeker/edit-profile"
              className="px-2 py-1 text-xs sm:text-sm bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Edit Profile</span>
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-2 py-1 text-xs sm:text-sm bg-white text-red-600 border border-red-600 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="whitespace-nowrap">Delete Profile</span>
            </button>
          </div>
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
  <div className="flex flex-wrap gap-6">
    {/* Skills Section */}
    <div className="w-full md:w-1/2">
      <h2 className="text-lg font-semibold mb-4">Skills</h2>
      <div className="flex items-start">
        <Brain className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
        <div>
          <div className="flex flex-wrap gap-2 mt-1">
            {userDetails.profile?.skills ? (
              userDetails.profile.skills.split(",").map((skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                >
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

    {/* Preferences Section */}
    <div className="w-full md:w-1/2">
      <PreferencesPage />
    </div>
  </div>
)}

    
          </div>

          {/* Quick Stats Sidebar */}
       
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300">

          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Your Profile</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete your profile? This action cannot be undone and all your data will be
                permanently removed.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="-ml-1 mr-2 h-4 w-4" />
                    Delete Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

