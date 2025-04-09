"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import { useNavigate } from "react-router-dom"
import {
  Building,
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
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:8000/api/get-employer-details/${userId}/`, {
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
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
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
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
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
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
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
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]" />

      <div className="container mx-auto px-4 -mt-20">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-end gap-4">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
              {profileData.comp_logo ? (
                <img
             
                  alt={`${profileData.comp_name} Logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building className="w-16 h-16 text-gray-300" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-black mb-6">{profileData.comp_name}</h1>
              <p className="text-white opacity-90">{profileData.industry}</p>
            </div>
          </div>

          <Link
            to="/employer/edit-profile"
            className="mt-4 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Edit className="w-4 h-4 inline mr-2" />
            Edit Profile
          </Link>
        </div>

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
    </div>
  )
}

