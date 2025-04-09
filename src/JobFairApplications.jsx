"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, data } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import {
  Briefcase,
  Search,
  Filter,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Eye,
  ArrowLeft,
  User,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react"

export default function JobFairApplications() {
  const { jobFairId } = useParams()
  const navigate = useNavigate()
  const [jobFair, setJobFair] = useState(null)
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterJob, setFilterJob] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [expandedApplication, setExpandedApplication] = useState(null)
  const [jobs, setJobs] = useState([])
  const authToken = localStorage.getItem("authToken")

  // Modal states for applicant actions
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("") // "approve", "decline", "view"
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionMessage, setActionMessage] = useState({ type: "", message: "" })

  useEffect(() => {
    fetchJobFair()
    fetchJobFairJobs()
    fetchApplications()
  }, [jobFairId])


  const fetchJobFair = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`https://hanapwede.com/api/jobfairs/${jobFairId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch job fair details")
      }

      const data = await response.json()
      setJobFair(data)
      
    } catch (error) {
      console.error("Error fetching job fair:", error)
      setError("Failed to load job fair details. Please try again.")
    }
  }

  const fetchJobFairJobs = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`https://hanapwede.com/api/jobfairs/${jobFairId}/employer/jobs/`, {
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
    }
  }


  const handleChat = async (employeeId) => {
    try {
      const response = await fetch("https://hanapwede.com/api/create_chat/", {
        method: "POST",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ other_user_id: employeeId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create chat")
      }

      const data = await response.json()
      navigate(`/chat/${data.room_id}`)
    } catch (error) {
      console.error("Error starting chat:", error)
    }
  }

  const fetchApplications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`https://hanapwede.com/api/jobfairs/${jobFairId}/applications/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }

      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error("Error fetching applications:", error)
      setError("Failed to load applications. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
    

  // Open modal with appropriate type for applicant actions
  const openModal = (type, applicant) => {
    setModalType(type)
    setSelectedApplicant(applicant)
    setShowModal(true)
    setActionMessage({ type: "", message: "" })
  }

  // Close modal and reset states
  const closeModal = () => {
    setShowModal(false)
    setSelectedApplicant(null)
    setModalType("")
    setIsProcessing(false)
    setActionMessage({ type: "", message: "" })
  }

  // Handle application approval
  const handleApprove = async () => {
    if (!selectedApplicant) return

    setIsProcessing(true)
    setActionMessage({ type: "", message: "" })

    try {
      const response = await fetch(
        `https://hanapwede.com/api/applications/${selectedApplicant.application_id}/approve/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to approve application")
      }

      // Update local state to reflect the change
      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === selectedApplicant.application_id ? { ...app, status: "Approved" } : app,
        ),
      )

      setActionMessage({
        type: "success",
        message: "Application approved successfully! The candidate will be notified.",
      })

      // Close modal after a delay
      setTimeout(() => {
        closeModal()
        // Refresh data
        fetchApplications()
      }, 2000)
    } catch (error) {
      console.error("Error approving application:", error)
      setActionMessage({
        type: "error",
        message: "Failed to approve application. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle application decline
  const handleDecline = async () => {
    if (!selectedApplicant) return

    setIsProcessing(true)
    setActionMessage({ type: "", message: "" })

    try {
      const response = await fetch(
        `https://hanapwede.com/api/applications/${selectedApplicant.application_id}/decline/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to decline application")
      }

      // Update local state to reflect the change
      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === selectedApplicant.application_id ? { ...app, status: "Declined" } : app,
        ),
      )

      setActionMessage({
        type: "success",
        message: "Application declined. The candidate will be notified.",
      })

      // Close modal after a delay
      setTimeout(() => {
        closeModal()
        // Refresh data
        fetchApplications()
      }, 2000)
    } catch (error) {
      console.error("Error declining application:", error)
      setActionMessage({
        type: "error",
        message: "Failed to decline application. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleExpandApplication = (id) => {
    setExpandedApplication(expandedApplication === id ? null : id)
  }

  // Filter and sort applications
  const filteredApplications = applications
    .filter((app) => {
      // Filter by search term
      const matchesSearch =
        app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_title?.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      const matchesStatus = filterStatus === "all" || app.application_status === filterStatus

      // Filter by job
      const matchesJob = filterJob === "all" || app.job_id.toString() === filterJob

      return matchesSearch && matchesStatus && matchesJob
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === "newest") {
        return new Date(b.applied_date) - new Date(a.applied_date)
      } else {
        return new Date(a.applied_date) - new Date(b.applied_date)
      }
    })

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Declined":
        return "bg-red-100 text-red-800"
      case "Interviewed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Approved":
        return <CheckCircle className="h-4 w-4" />
      case "Declined":
        return <XCircle className="h-4 w-4" />
      case "Interviewed":
        return <Calendar className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.application_status === "Pending").length,
    approved: applications.filter((app) => app.application_status === "Approved").length,
    declined: applications.filter((app) => app.application_status === "Declined").length,
    interviewed: applications.filter((app) => app.application_status === "Interviewed").length,
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/job-fairs")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job Fairs
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {jobFair ? `Applications for ${jobFair.title}` : "Job Fair Applications"}
          </h1>
          <div className="text-gray-600">
            {jobFair && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(jobFair.date)}
              </div>
            )}
          </div>
        </div>

        {/* Application Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold">{stats.approved}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Declined</p>
              <p className="text-2xl font-bold">{stats.declined}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Interviewed</p>
              <p className="text-2xl font-bold">{stats.interviewed}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
             
                </select>
              </div>

              {/*<div className="flex items-center">
                <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={filterJob}
                  onChange={(e) => setFilterJob(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Jobs</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.job_title}
                    </option>
                  ))}
                </select>
              </div>*/}

              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

       
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 text-blue-600 animate-spin mr-3" />
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <User className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm || filterStatus !== "all" || filterJob !== "all"
                  ? "No applications match your current filters"
                  : "There are no applications for this job fair yet"}
              </p>
              {(searchTerm || filterStatus !== "all" || filterJob !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterStatus("all")
                    setFilterJob("all")
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <div key={application.application_id} className="hover:bg-gray-50 transition-colors">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex-shrink-0 mr-4 flex items-center justify-center">
                            {application.applicant_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                              <h3 className="font-medium text-lg">{application.applicant_name}</h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                  application.application_status,
                                )} mt-1 sm:mt-0 sm:ml-2`}
                              >
                                {getStatusIcon(application.application_status)}
                                <span className="ml-1">{application.application_status}</span>
                              </span>
                            </div>
                            <p className="text-gray-600">{application.job_title}</p>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                              <div className="flex items-center mr-4">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {application.applicant_location || "Not specified"}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                Applied on {formatDate(application.applied_date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mt-4 md:mt-0">
                        <button
                          onClick={() => openModal("view", application)}
                          className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 mr-2"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {application.application_status === "Pending" && (
                          <>
                            <button
                              onClick={() => openModal("approve", application)}
                              className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100 mr-2"
                              title="Approve Application"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openModal("decline", application)}
                              className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                              title="Decline Application"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => toggleExpandApplication(application.application_id)}
                          className="ml-3 flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                          {expandedApplication === application.application_id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              View Details
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedApplication === application.application_id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/*  <div>
                            <h4 className="font-medium text-gray-700 mb-2">Applicant Details</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{application.applicant_email || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{application.applicant_phone || "Not provided"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Experience</p>
                                <p className="font-medium">{application.applicant_experience || "Not specified"}</p>
                              </div>
                     
                            </div>
                          </div>*/}

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Application Details</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium">{application.application_status}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Applied For</p>
                                <p className="font-medium">{application.job_title}</p>
                              </div>

                              {/*<div>
                                <p className="text-sm text-gray-500">Resume</p>
                                <div className="flex items-center mt-1">
                                  <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                  <a
                                    href={application.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    View Resume
                                  </a>
                                </div>
                              </div>
                      */}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          {/*<button
                            onClick={() => window.open(`/job/${application.job_id}`, "_blank")}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Job Details
                          </button>*/}
                          <button
                            onClick={() => {
                        

                         handleChat(application.applicant_id)
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Applicant
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for application actions */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === "view" && "Applicant Details"}
                {modalType === "approve" && "Approve Application"}
                {modalType === "decline" && "Decline Application"}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {actionMessage.type && (
                <div
                  className={`mb-4 p-3 rounded ${
                    actionMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="flex">
                    {actionMessage.type === "success" ? (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    <p>{actionMessage.message}</p>
                  </div>
                </div>
              )}

              {selectedApplicant && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                      {selectedApplicant.applicant_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedApplicant.applicant_name}</h4>
                      <p className="text-sm text-gray-500">Applied for: {selectedApplicant.job_title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{selectedApplicant.applicant_experience || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedApplicant.applicant_location || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          selectedApplicant.application_status,
                        )}`}
                      >
                        {getStatusIcon(selectedApplicant.application_status)}
                        <span className="ml-1">{selectedApplicant.application_status}</span>
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Applied On</p>
                      <p className="font-medium">{formatDate(selectedApplicant.applied_date)}</p>
                    </div>
                  </div>

                  {modalType === "view" && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Cover Letter</p>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        {selectedApplicant.cover_letter || "No cover letter provided."}
                      </div>
                    </div>
                  )}

                  {modalType === "approve" && (
                    <div className="mt-4">
                      <p className="text-gray-700">
                        Are you sure you want to approve this application? The candidate will be notified.
                      </p>
                    </div>
                  )}

                  {modalType === "decline" && (
                    <div className="mt-4">
                      <p className="text-gray-700">
                        Are you sure you want to decline this application? The candidate will be notified.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {modalType === "view" ? "Close" : "Cancel"}
              </button>

              {modalType === "approve" && (
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </button>
              )}

              {modalType === "decline" && (
                <button
                  onClick={handleDecline}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="-ml-1 mr-2 h-4 w-4" />
                      Decline
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

