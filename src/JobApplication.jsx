"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import Swal from "sweetalert2"
import { baseURL } from './constants';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  User,
  Award,
  Tag,
  AlertCircle,
  Loader,
  CheckCircle,
  Edit,
  Eye,
} from "lucide-react"

export default function JobApplication() {
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
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get("post_id")
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_role: "",
    applicant_experience: "",
    applicant_location: "",
  })

  const [skills, setSkills] = useState([])
  const [resume, setResume] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isIncomplete, setIsIncomplete] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleEditProfile = () => {
    navigate("/job-seeker/edit-profile")
  }

  // Fetch user profile data
  useEffect(() => {
    const token = localStorage.getItem("authToken")

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
        const profile = data.profile

        // Autofill form fields with user details
        setFormData({
          applicant_name: profile.full_name || "",
          applicant_role: profile.role || "",
          applicant_experience: profile.experience || "",
          applicant_location: profile.location || "",
        })

        // Convert skills string to an array
        setSkills(profile.skills ? profile.skills.split(",").map((skill) => skill.trim()) : [])

        // Set resume file reference
        setResume(profile.employee_resume ? profile.employee_resume : null)
      })
      .catch((error) => {
        console.error("Error fetching user details:", error)
      })
  }, [userId])

  // Check for incomplete profile
  useEffect(() => {
    if (
      !formData.applicant_name ||
      !formData.applicant_role ||
      !formData.applicant_experience ||
      !formData.applicant_location ||
      skills.length === 0
    ) {
      setIsIncomplete(true)
    } else {
      setIsIncomplete(false)
    }
  }, [formData, skills])

  // Fetch job details
  useEffect(() => {
    if (!jobId) {
      setError("Job not found.")
      setLoading(false)
      return
    }

    fetch(`${baseURL}/api/job/${jobId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job details")
        return res.json()
      })
      .then((data) => {
        setJob(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [jobId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if all required fields are filled
    if (isIncomplete) {
      handleError("Please complete your profile before submitting an application.")
      return
    }

    setIsSubmitting(true)

    const formDataToSend = new FormData()
    formDataToSend.append("applicant_name", formData.applicant_name)
    formDataToSend.append("applicant_role", formData.applicant_role)
    formDataToSend.append("applicant_experience", formData.applicant_experience)
    formDataToSend.append("applicant_location", formData.applicant_location)
    formDataToSend.append("applicant_skills", skills.join(","))
    formDataToSend.append("job_post", jobId)
    formDataToSend.append("application_action", "For Approval")

    // Append the resume if available
    if (resume && typeof resume === "string") {
      formDataToSend.append("resume", resume)
    } else if (resume) {
      formDataToSend.append("resume", resume)
    }

    try {
      const response = await fetch(`${baseURL}/api/submit-application/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to submit application")
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        navigate("/job-seeker/dashboard")
      }, 3000)
    } catch (error) {
      handleError("Error submitting application: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <Loader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading job details...</p>
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
              <button
                onClick={() => navigate("/job-seeker/dashboard")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your application has been successfully submitted. You will be redirected to the dashboard shortly.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-green-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      {/* Banner with job title */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#00BCD4] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">{job.job_title}</h1>
          <div className="flex flex-wrap items-center text-white opacity-90">
            <div className="flex items-center mr-6 mb-2">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>{job.comp_name}</span>
            </div>
            <div className="flex items-center mr-6 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center mr-6 mb-2">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{job.salary_range}</span>
            </div>
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span>{job.job_type}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Job details */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Job Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Job Description</h3>
                  <p className="mt-1 text-gray-800">{job.job_desc}</p>
                </div>

                {job.tags && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.tags.split(",").map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.disabilitytag && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Suitable For</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.disabilitytag.split(",").map((tag, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Application form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                Submit Your Application
              </h2>

              {isIncomplete && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                  <div className="flex">
                    <AlertCircle className="h-6 w-6 text-amber-500 mr-3" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium">Your profile is incomplete</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Please update your profile with all required information before applying.
                      </p>
                      <button
                        onClick={handleEditProfile}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Complete Your Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="applicant_name"
                      value={formData.applicant_name}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                      Role
                    </label>
                    <input
                      type="text"
                      name="applicant_role"
                      value={formData.applicant_role}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2 text-gray-500" />
                      Experience
                    </label>
                    <input
                      type="text"
                      name="applicant_experience"
                      value={formData.applicant_experience}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="applicant_location"
                      value={formData.applicant_location}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-gray-500" />
                    Skills
                  </label>
                  <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px]">
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No skills listed. Please update your profile.</p>
                    )}
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    Resume
                  </label>
                  <div className="mt-1 p-6 border border-gray-300 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                    {resume ? (
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-700 mb-2">Resume uploaded</p>
                        <a
                         href={`${baseURL}${resume}`}


                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Resume
                        </a>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No resume uploaded.</p>
                        <p className="text-sm text-gray-500 mt-1">Please update your profile to add a resume.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isIncomplete || isSubmitting}
                    className={`w-full px-6 py-3 rounded-lg shadow-sm text-white font-medium flex items-center justify-center ${
                      isIncomplete || isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 transition-colors"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>

                  {isIncomplete && (
                    <p className="mt-2 text-sm text-center text-red-500">
                      Please complete your profile before submitting
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

