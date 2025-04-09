"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./Header"
import LoggedInHeader from "./LoggedInHeader"
import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Tag,
  Accessibility,
  Building,
  Clock,
  CheckCircle,
  Loader,
  AlertCircle,
  ArrowLeft,
} from "lucide-react"

export default function PostJobForm() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [disabilityTags, setDisabilityTags] = useState([])
  const [jobTags, setJobTags] = useState([])
  const [selectedDisabilityTags, setSelectedDisabilityTags] = useState([])
  const [selectedJobTags, setSelectedJobTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)

    const fetchTags = async () => {
      try {
        const headers = token ? { Authorization: `Token ${token}` } : {}

        const disabilityRes = await fetch("http://194.163.40.84/api/disability-tags/", { headers })
        const disabilityData = await disabilityRes.json()
        setDisabilityTags(disabilityData)

        const jobTagsRes = await fetch("http://194.163.40.84/api/tags", { headers })
        const jobTagsData = await jobTagsRes.json()
        setJobTags(jobTagsData)
      } catch (error) {
        console.error("Error fetching tags:", error)
      }
    }

    fetchTags()
  }, [])

  const [formData, setFormData] = useState({
    job_title: "",
    job_desc: "",
    job_type: "Full Time",
    skills_req: "",
    category: "Technology",
    salary_range: "",
    location: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDisabilityTagChange = (e) => {
    const { value, checked } = e.target
    const tagId = Number(value)

    setSelectedDisabilityTags((prevTags) => (checked ? [...prevTags, tagId] : prevTags.filter((tag) => tag !== tagId)))
  }

  const handleJobTagChange = (e) => {
    const { value, checked } = e.target
    const tagId = Number(value)

    setSelectedJobTags((prevTags) => (checked ? [...prevTags, tagId] : prevTags.filter((tag) => tag !== tagId)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: "", message: "" })

    const token = localStorage.getItem("authToken")

    if (!token) {
      setSubmitStatus({
        type: "error",
        message: "You must be logged in to post a job.",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("http://194.163.40.84/api/post-job/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          disabilitytag: selectedDisabilityTags,
          tags: selectedJobTags,
        }),
      })

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Job posted successfully! Redirecting to dashboard...",
        })
        setTimeout(() => {
          navigate("/employer/dashboard")
        }, 2000)
      } else {
        console.error("Error posting job:", response.statusText)
        setSubmitStatus({
          type: "error",
          message: "Failed to post job. Please check your inputs and try again.",
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

  const jobCategories = [
    "Technology",
    "Sales",
    "Marketing",
    "Finance",
    "Education",
    "Healthcare",
    "Customer Service",
    "Administrative",
    "Engineering",
    "Design",
    "Human Resources",
    "Legal",
    "Manufacturing",
    "Retail",
    "Transportation",
  ]

  const jobTypes = ["Full Time", "Part Time", "Contract", "Freelance", "Internship", "Remote"]

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {isLoggedIn ? <LoggedInHeader /> : <Header />}


      <div className="h-40 bg-[#7cd1ed]" />

      <div className="container mx-auto px-4 -mt-20">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-end gap-4">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white flex items-center justify-center">
              <Briefcase className="w-16 h-16 text-blue-500" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-4">Post a New Job</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Job Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                Basic Job Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="job_title"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleChange}
                      placeholder="e.g. Frontend Developer"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    >
                      {jobCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="job_type"
                      name="job_type"
                      value={formData.job_type}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    >
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Manila, Philippines"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="salary_range"
                      name="salary_range"
                      value={formData.salary_range}
                      onChange={handleChange}
                      placeholder="e.g. ₱30,000 - ₱50,000"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Job Description
              </h2>

              <div>
                <label htmlFor="job_desc" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Job Description*
                </label>
                <textarea
                  id="job_desc"
                  name="job_desc"
                  value={formData.job_desc}
                  onChange={handleChange}
                  placeholder="Describe the job responsibilities, requirements, and any other relevant information..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-40"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Provide a comprehensive description to attract qualified candidates.
                </p>
              </div>

              <div className="mt-6">
                <label htmlFor="skills_req" className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <textarea
                  id="skills_req"
                  name="skills_req"
                  value={formData.skills_req}
                  onChange={handleChange}
                  placeholder="List the skills required for this position..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Separate skills with commas (e.g., Communication, Problem-solving, JavaScript)
                </p>
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-600" />
                Job Tags
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Disability Tags */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Accessibility className="w-5 h-5 mr-2 text-blue-600" />
                    Suitable for Disabilities
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select the disabilities that this job position can accommodate:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {disabilityTags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center p-2 bg-white rounded-md border border-gray-200 hover:bg-blue-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={tag.id}
                          checked={selectedDisabilityTags.includes(tag.id)}
                          onChange={handleDisabilityTagChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job Tags */}
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-green-600" />
                    Job Tags
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select relevant tags to help job seekers find your posting:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {jobTags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center p-2 bg-white rounded-md border border-gray-200 hover:bg-green-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={tag.id}
                          checked={selectedJobTags.includes(tag.id)}
                          onChange={handleJobTagChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/employer/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Posting Job...
                  </>
                ) : (
                  <>
                    <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
                    Post Job
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

