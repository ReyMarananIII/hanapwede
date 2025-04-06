"use client"

import { useState, useEffect } from "react"
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Building,
  AlertCircle,
  Loader,
  CheckCircle,
} from "lucide-react"

export default function JobFairDetails({ jobFair, onClose }) {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isApplying, setIsApplying] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(null)
  const [applicationJobId, setApplicationJobId] = useState(null)

  useEffect(() => {
    fetchJobFairJobs()
  
  }, [])

  useEffect(() => {
    console.log(jobs)
  }
  , [jobs])

  const fetchJobFairJobs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`http://localhost:8000/api/jobfairs/${jobFair.id}/jobs/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch job fair jobs")
      }

      const data = await response.json()
      setJobs(data.jobs)

    } catch (error) {
      console.error("Error fetching job fair jobs:", error)
      setError("Failed to load jobs for this job fair. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async (jobId) => {
    setIsApplying(true)
    setApplicationJobId(jobId)
    setApplicationSuccess(null)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://localhost:8000/api/job-applications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          job: jobId,
          job_fair: jobFair.id,
          cover_letter: "Applied through Job Fair", // Optional cover letter
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to apply for job")
      }

      setApplicationSuccess(`Successfully applied for the job!`)

      // Update jobs to mark this one as applied
      setJobs(jobs.map((job) => (job.post_id === jobId ? { ...job, has_applied: true } : job)))
    } catch (error) {
      console.error("Error applying for job:", error)
      setApplicationSuccess(`Failed to apply: ${error.message}`)
    } finally {
      setIsApplying(false)
      setApplicationJobId(null)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{jobFair.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {applicationSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                <p className="text-green-700">{applicationSuccess}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Job Fair Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>
                    <span className="font-medium">Date:</span> {formatDate(jobFair.date)}
                  </span>
                </div>
         
        
                {jobFair.contact_email && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 mr-3 text-blue-600" />
                    <span>
                      <span className="font-medium">Contact Email:</span> {jobFair.contact_email}
                    </span>
                  </div>
                )}
                {jobFair.contact_phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 mr-3 text-blue-600" />
                    <span>
                      <span className="font-medium">Contact Phone:</span> {jobFair.contact_phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">About This Job Fair</h3>
              <p className="text-gray-700">{jobFair.description || "No description provided."}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              Available Jobs ({jobs.length})
            </h3>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No jobs available for this job fair.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.post_id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-lg font-medium">{job.job_title}</h4>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Building className="h-4 w-4 mr-2" />
                          <span>{job.company_name || jobFair.employer_name}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        {job.has_applied ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(job.post_id)}
                            disabled={isApplying && applicationJobId === job.post_id}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isApplying && applicationJobId === job.post_id ? (
                              <Loader className="animate-spin h-4 w-4 mr-2" />
                            ) : (
                              <Briefcase className="h-4 w-4 mr-2" />
                            )}
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
               
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

