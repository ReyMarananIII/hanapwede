"use client"

import { useState, useEffect } from "react"
import { X, Loader, Calendar, Clock, MapPin, Phone, Mail, Save } from "lucide-react"

export default function EditJobFairForm({ jobFair, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: jobFair.title || "",
    description: jobFair.description || "",
    date: jobFair.date || "",

  
    email: jobFair.email || "",
    contact_number: jobFair.contact_number || "",
    selected_jobs: []
  })
  const [availableJobs, setAvailableJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch employer's jobs
    const fetchJobs = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("https://hanapwede.com/api/employer-jobs/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }

        const data = await response.json()
        setAvailableJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
        setError("Failed to load jobs. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleJobToggle = (jobId) => {
    setFormData((prev) => {
      const isSelected = prev.selected_jobs.includes(jobId)
      return {
        ...prev,
        selected_jobs: isSelected ? prev.selected_jobs.filter((id) => id !== jobId) : [...prev.selected_jobs, jobId],
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate form
    if (!formData.title || !formData.date ) {
      setError("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    // Validate that at least one job is selected
    if (formData.selected_jobs.length === 0) {
      setError("Please select at least one job for the job fair.")
      setIsSubmitting(false)
      return
    }

    // Format data for API
    const jobFairData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,

   
      email: formData.email,
      contact_number: formData.contact_number,
      jobs: formData.selected_jobs,
    }

    const result = await onSubmit(jobFairData)

    if (!result.success) {
      setError(result.error || "Failed to update job fair. Please try again.")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Job Fair</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Fair Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
      
          </div>

    

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       

            <div>
              <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
                Contact Phone
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="contact_number"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Jobs for this Job Fair*</label>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            ) : availableJobs.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You don't have any jobs posted yet. Please create jobs first before updating a job fair.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {availableJobs.map((job) => (
                    <div
                      key={job.post_id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 ${
                        formData.selected_jobs.includes(job.post_id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`job-${job.post_id}`}
                          checked={formData.selected_jobs.includes(job.post_id)}
                          onChange={() => handleJobToggle(job.post_id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`job-${job.post_id}`} className="ml-3 block">
                          <span className="block text-sm font-medium text-gray-900">{job.job_title}</span>
                          <span className="block text-sm text-gray-500">
                            {job.job_type} • {job.location}
                          </span>
                        </label>
                      </div>
                  
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableJobs.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="-ml-1 mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

