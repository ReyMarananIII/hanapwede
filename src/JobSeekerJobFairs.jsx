"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, Briefcase, Clock, AlertCircle, Loader, CheckCircle, ExternalLink } from "lucide-react"
import JobFairDetails from "./JobFairDetails"

export default function JobSeekerJobFairs() {
  const [jobFairs, setJobFairs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedJobFair, setSelectedJobFair] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [registrations, setRegistrations] = useState([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(null)

  useEffect(() => {
    fetchJobFairs()
    fetchRegistrations()
  }, [])

  const fetchJobFairs = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://localhost:8000/api/jobfairs/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch job fairs")
      }

      const data = await response.json()
      setJobFairs(data)
    } catch (error) {
      console.error("Error fetching job fairs:", error)
      setError("Failed to load job fairs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://localhost:8000/api/jobfair-registrations/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch registrations")
      }

      const data = await response.json()
      setRegistrations(data)
    } catch (error) {
      console.error("Error fetching registrations:", error)
    }
  }

  const handleRegister = async (jobFairId) => {
    setIsRegistering(true)
    setRegistrationSuccess(null)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://localhost:8000/api/jobfair-registrations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ job_fair: jobFairId }),
      })

      if (!response.ok) {
        throw new Error("Failed to register for job fair")
      }

      const data = await response.json()
      setRegistrations([...registrations, data])
      setRegistrationSuccess(`Successfully registered for the job fair!`)

      // Refresh job fairs to update registration count
      fetchJobFairs()
    } catch (error) {
      console.error("Error registering for job fair:", error)
      setRegistrationSuccess(`Failed to register: ${error.message}`)
    } finally {
      setIsRegistering(false)
    }
  }

  const isRegistered = (jobFairId) => {
    return registrations.some((reg) => reg.job_fair === jobFairId)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }



  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Available Job Fairs</h1>
      </div>

      {registrationSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
            <p className="text-green-700">{registrationSuccess}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : jobFairs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Job Fairs Available</h2>
          <p className="text-gray-600 mb-6">There are no job fairs available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobFairs.map((jobFair) => (
            <div key={jobFair.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{jobFair.title}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(jobFair.date)}</span>
                </div>
               
       
                <div className="flex items-center text-gray-600 mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{jobFair.registrations_count || 0} Registrations</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{jobFair.jobs_count || 0} Jobs</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-between">
                {isRegistered(jobFair.id) ? (
                  <button
                    onClick={() => {
                      setSelectedJobFair(jobFair)
                      setShowDetailsModal(true)
                    }}
                    className="w-full text-green-600 hover:text-green-800 flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(jobFair.id)}
                    disabled={isRegistering}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRegistering ? (
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <ExternalLink className="h-4 w-4 mr-2" />
                    )}
                    Register Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Fair Details Modal */}
      {showDetailsModal && selectedJobFair && (
        <JobFairDetails
          jobFair={selectedJobFair}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedJobFair(null)
          }}
        />
      )}
    </div>
  )
}

