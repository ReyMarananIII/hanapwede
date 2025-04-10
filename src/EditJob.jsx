"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import { Briefcase, CheckCircle, AlertCircle, Loader, ArrowLeft } from "lucide-react"

import { baseURL } from './constants';

export default function EditJob() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const authToken = localStorage.getItem("authToken")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Form data state
  const [formData, setFormData] = useState({
    job_title: "",
    category: "",
    location: "",
    salary_range: "",
    job_desc: "",
    job_type: "",
    tags: "",
  })

  // Tags state
  const [availableDisabilityTags, setAvailableDisabilityTags] = useState([])
  const [selectedDisabilityTags, setSelectedDisabilityTags] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  // Fetch job data and tags when component mounts
  useEffect(() => {
    const fetchJobData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch job details
        const jobResponse = await fetch(`${baseURL}/api/job/${jobId}/`, {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        })

        if (!jobResponse.ok) {
          throw new Error("Failed to fetch job details")
        }

        const jobData = await jobResponse.json()
        setFormData({
          job_title: jobData.job_title || "",
          category: jobData.category || "",
          location: jobData.location || "",
          salary_range: jobData.salary_range || "",
          job_desc: jobData.job_desc || "",
          job_type: jobData.job_type || "",
   
        })

        // Fetch all available tags
        await Promise.all([fetchDisabilityTags(), fetchTags(), fetchJobDisabilityTags(jobId), fetchJobTags(jobId)])
      } catch (error) {
        console.error("Error fetching job data:", error)
        setError("Failed to load job data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (jobId && authToken) {
      fetchJobData()
    }
  }, [jobId, authToken])

  // Function to fetch disability tags
  const fetchDisabilityTags = async () => {
    try {
      const response = await fetch(`${baseURL}/api/disability-tags/`, {
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch disability tags")
      }

      const data = await response.json()
      setAvailableDisabilityTags(data)
    } catch (error) {
      console.error("Error fetching disability tags:", error)
    }
  }

  // Function to fetch job-specific disability tags
  const fetchJobDisabilityTags = async (jobId) => {
    try {
      const response = await fetch(`${baseURL}/api/job-post-disability-tags/${jobId}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch job disability tags")
      }

      const data = await response.json()
      setSelectedDisabilityTags(data.map((tag) => tag.id))
    } catch (error) {
      console.error("Error fetching job disability tags:", error)
    }
  }

  // Function to fetch general tags
  const fetchTags = async () => {
    try {
      const response = await fetch(`${baseURL}/api/tags/`, {
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tags")
      }

      const data = await response.json()
      setAvailableTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  // Function to fetch job-specific tags
  const fetchJobTags = async (jobId) => {
    try {
      const response = await fetch(`${baseURL}/api/job-post-tags/${jobId}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch job tags")
      }

      const data = await response.json()
      setSelectedTags(data.map((tag) => tag.id))
    } catch (error) {
      console.error("Error fetching job tags:", error)
    }
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle disability tag selection
  const handleDisabilityTagChange = (tagId) => {
    setSelectedDisabilityTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }

  // Handle general tag selection
  const handleTagChange = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId)
      } else {
        return [...prev, tagId]
      }
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Create the request body with form data and both sets of tags
      const requestBody = {
        ...formData,
        disabilitytag: selectedDisabilityTags,
        tags: selectedTags,
      }

      const response = await fetch(`${baseURL}/api/edit-job-post/${jobId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to update job posting")
      }

      setSuccessMessage("Job posting updated successfully!")

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" })

      // Navigate back to dashboard after a delay
      setTimeout(() => {
        navigate("/employer/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error updating job:", error)
      setError("Failed to update job posting. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading job data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/employer/dashboard")}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
              <Briefcase className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Edit Job Posting</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-50 text-red-800 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-md bg-green-50 text-green-800 flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">
                  Job Type
                </label>
                <select
                  id="job_type"
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700">
                  Salary Range
                </label>
                <input
                  type="text"
                  id="salary_range"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. 30,000-50,000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="job_desc" className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                id="job_desc"
                name="job_desc"
                rows={6}
                value={formData.job_desc}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Job Tags</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">General Tags</label>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTags.map((tag) => (
                    <div key={tag.id} className="flex items-center">
                      <input
                        id={`tag-${tag.id}`}
                        name={`tag-${tag.id}`}
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagChange(tag.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-gray-700">
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suitable for Disabilities</label>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableDisabilityTags.map((tag) => (
                    <div key={tag.id} className="flex items-center">
                      <input
                        id={`disability-tag-${tag.id}`}
                        name={`disability-tag-${tag.id}`}
                        type="checkbox"
                        checked={selectedDisabilityTags.includes(tag.id)}
                        onChange={() => handleDisabilityTagChange(tag.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`disability-tag-${tag.id}`} className="ml-2 block text-sm text-gray-700">
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate("/employer/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                    Save Changes
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

