"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import { useNavigate } from "react-router-dom"
import { baseURL } from './constants';

import {
  Building,
  Trash2,
  FileText,
  Globe,
  Briefcase,
  MapPin,
  Phone,
  Edit,
  Loader,
  AlertCircle,
  ExternalLink,
} from "lucide-react"

export default function EmployerProfile() {
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const userId = localStorage.getItem("userId")
  const [showDeleteModal, setShowDeleteModal] = useState(false)


  const handleDeleteProfile = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${baseURL}/api/delete-emp-account/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
      
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

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${baseURL}/api/get-employer-details/${userId}/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()
    
        setProfileData(data.profile)
       
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile information. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFF]">
        {/*<LoggedInHeader />*/}
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFFF]">
       {/* <LoggedInHeader />*/}
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center mb-2">Error</h2>
            <p className="text-red-500 text-center">{error}</p>
            <div className="mt-6 text-center">
              <Link
                to="/employer/edit-profile"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Create Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#FFFFF]">
        {/*<LoggedInHeader />*/}
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Profile Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't created an employer profile yet. Create one to start posting jobs.
            </p>
            <Link
              to="/employer/edit-profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFFF]">
     {/* <LoggedInHeader />*/}

    
      <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg" />

      <div className="container mx-auto px-2 sm:px-4 -mt-20">
  {/* Header Section */}
  <div className="flex flex-col justify-between items-center mb-8">
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
        {profileData.comp_logo ? (
          <img
            src={profileData.comp_logo}
            alt={`${profileData.comp_name} Logo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <Building className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-300" />
        )}
      </div>

      <div className="text-center mt-1 sm:mt-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-black-500 mb-1">
          {profileData.comp_name}
        </h1>
        <p className="text-black-500 mb-3 sm:mb-6 font-bold opacity-90 text-sm sm:text-base">
          {profileData.industry}
        </p>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mt-2 w-full justify-center">
      <Link
        to="/employer/edit-profile"
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
  </div>

  {/* Grid Content Section */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Main Content */}
    <div className="md:col-span-2">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Building className="w-5 h-5 mr-2 text-blue-600" />
          Company Information
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              About the Company
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 whitespace-pre-line">{profileData.comp_desc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Industry
              </h3>
              <p className="text-gray-800">{profileData.industry}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </h3>
              <p className="text-gray-800">{profileData.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Website
              </h3>
              {profileData.comp_site ? (
                <a
                  href={
                    profileData.comp_site.startsWith("http")
                      ? profileData.comp_site
                      : `https://${profileData.comp_site}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  {profileData.comp_site}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              ) : (
                <p className="text-gray-500 italic">Not provided</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Contact Number
              </h3>
              <p className="text-gray-800">{profileData.contact_no}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Sidebar */}
    <div className="md:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="space-y-3">
          <Link
            to="/employer/post-job"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Post a New Job
          </Link>

          <Link
            to="/employer/dashboard"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Building className="w-4 h-4 mr-2" />
            View Dashboard
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Company Profile Status</h3>
          <div className="bg-green-50 rounded-lg p-3 flex items-start">
            <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Profile Complete</p>
              <p className="text-xs text-green-700 mt-0.5">
                Your company profile is set up and visible to job seekers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


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

