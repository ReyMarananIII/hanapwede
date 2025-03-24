"use client"

import { useState, useEffect } from "react"
import LoggedInHeader from "./LoggedInHeader"
import {
  Building,
  FileText,
  Globe,
  Briefcase,
  MapPin,
  Phone,
  Upload,
  Save,
  Loader,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function EditEmployerProfile() {
  const [formData, setFormData] = useState({
    comp_name: "",
    comp_desc: "",
    comp_site: "",
    industry: "",
    location: "",
    contact_no: "",
  })

  const [companyLogo, setCompanyLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" })
  const [isLoading, setIsLoading] = useState(true)

  const userId = localStorage.getItem("userId")

  // Fetch existing profile data if available
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8000/api/get-employer-details/${userId}/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setFormData({
            comp_name: data.profile.comp_name || "",
            comp_desc: data.profile.comp_desc || "",
            comp_site: data.profile.comp_site || "",
            industry: data.profile.industry || "",
            location: data.profile.location || "",
            contact_no: data.profile.contact_no || "",
          })

          if (data.comp_logo) {
            setLogoPreview(`http://localhost:8000${data.comp_logo}`)
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCompanyLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: "", message: "" })

    const formDataToSend = new FormData()

    // Add text fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key])
    })

    // Add logo if available
    if (companyLogo) {
      formDataToSend.append("comp_logo", companyLogo)
    }

    try {
      const response = await fetch("http://localhost:8000/api/employer-profile/", {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: formDataToSend,
      })

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Employer profile updated successfully!",
        })

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        const errorData = await response.json()
        setSubmitStatus({
          type: "error",
          message: errorData.detail || "Failed to update profile. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6]" />

      <div className="container mx-auto px-4 -mt-20">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-end gap-4">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building className="w-16 h-16 text-gray-300" />
              )}
            </div>
            <h1 className="text-2xl font-semibold text-white mb-4">Employer Profile</h1>
          </div>
        </div>

        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start">
              {submitStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
              )}
              <p className={submitStatus.type === "success" ? "text-green-700" : "text-red-700"}>
                {submitStatus.message}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Company Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-2 text-gray-500" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="comp_name"
                      value={formData.comp_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      readOnly
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="e.g. Technology, Healthcare, Finance"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    Company Description
                  </label>
                  <textarea
                    name="comp_desc"
                    value={formData.comp_desc}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                    required
                    placeholder="Describe your company, mission, and values..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-500" />
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="comp_site"
                      value={formData.comp_site}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact_no"
                      value={formData.contact_no}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="e.g. +63 912 345 6789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="City, Province, Country"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-3 rounded-lg shadow-sm text-white font-medium flex items-center justify-center ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 transition-colors"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
          

          

              <div className="bg-blue-50 rounded-lg p-4">
  <h3 className="text-sm font-medium text-blue-800 mb-2">Unlock More Opportunities with a Complete Profile</h3>
  <ul className="text-sm text-blue-700 space-y-2">
    <li className="flex items-start">
      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
      <span>Connect with skilled PWD job seekers who are ready to contribute</span>
    </li>
    <li className="flex items-start">
      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
      <span>Demonstrate your commitment to inclusivity and equal opportunity</span>
    </li>
    <li className="flex items-start">
      <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
      <span>Strengthen your company's reputation as an accessible and inclusive workplace</span>
    </li>
  </ul>
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

