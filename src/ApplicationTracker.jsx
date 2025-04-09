"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import {
  Briefcase,
  Search,
  Filter,
  Clock,
  Building,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Eye,
  FileText,
  Loader,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Delete,
} from "lucide-react"

export default function ApplicationTracker() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [expandedApplication, setExpandedApplication] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    declined: 0,
    interviewed: 0,
  })

  // Fetch applications when component mounts
  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch("http://194.163.40.84/api/my-applications/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }

      const data = await response.json()
      setApplications(data)

      // Calculate statistics
      console.log(data)
     
      const stats = {
        total: data.length,
        pending: data.filter((app) => app.application_status === "Pending").length,
        approved: data.filter((app) => app.application_status === "Approved").length,
        declined: data.filter((app) => app.application_status === "Declined").length,
        interviewed: data.filter((app) => app.application_status === "Interviewed").length,
      }
      setStats(stats)
    } catch (error) {
      console.error("Error fetching applications:", error)
      setError(error.message || "Failed to load applications")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("Updated applications:", applications)
  }, [applications])

  const refreshApplications = async () => {
    setIsRefreshing(true)
    await fetchApplications()
    setIsRefreshing(false)
  }

  const handleContactEmployer = async (employerId) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://194.163.40.84/api/create_chat/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ other_user_id: employerId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create chat")
      }

      const data = await response.json()
      navigate(`/chat/${data.room_id}`)
    } catch (error) {
      console.error("Error starting chat:", error)
      alert("Failed to start chat with employer. Please try again.")
    }
  }

  const handleCancelApplication = async (applicationId) => {
    if (window.confirm("Are you sure you want to cancel this application?")) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://194.163.40.84/api/cancel-application/${applicationId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete application");
        }
        alert("Application cancelled successfully.");
      } catch (error) {
        console.error("Error deleting application:", error);
        alert("Failed to delete application. Please try again.");
      }
    }
  };
  
      




  const toggleExpandApplication = (id) => {
    setExpandedApplication(expandedApplication === id ? null : id)
  }

  // Filter and sort applications
  const filteredApplications = applications
    .filter((app) => {
      // Filter by search term
      const matchesSearch =
      (app.jobpost__job_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.jobpost__location || "").toLowerCase().includes(searchTerm.toLowerCase())
      

      // Filter by status
      const matchesStatus = filterStatus === "all" || app.application_status === filterStatus

      return matchesSearch && matchesStatus
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

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center mb-4 md:mb-0">
            <Briefcase className="mr-2 h-6 w-6 text-[#4CAF50]" />
            Current Job Applications
          </h1>
          <button
            onClick={refreshApplications}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049] disabled:bg-opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isRefreshing ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Applications
          </button>
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
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Declined">Declined</option>
               
                </select>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
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
              <Loader className="h-8 w-8 text-[#4CAF50] animate-spin mr-3" />
              <p className="text-gray-600">Loading your applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Briefcase className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm || filterStatus !== "all"
                  ? "No applications match your current filters"
                  : "You haven't applied to any jobs yet"}
              </p>
              {searchTerm || filterStatus !== "all" ? (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterStatus("all")
                  }}
                  className="mt-4 px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049]"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={() => navigate("/job-seeker/dashboard")}
                  className="mt-4 px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049]"
                >
                  Browse Jobs
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
                        
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                              <h3 className="font-medium text-lg">{application.job_title}</h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                  application.application_status,
                                )} mt-1 sm:mt-0 sm:ml-2`}
                              >
                                {getStatusIcon(application.application_status)}
                                <span className="ml-1">{application.application_status}</span>
                              </span>
                            </div>
                            <p className="text-gray-600">{application.company_name}</p>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                              <div className="flex items-center mr-4">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {application.location || "Remote"}
                              </div>
                         
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mt-4 md:mt-0">
                        <button
                          onClick={() => toggleExpandApplication(application.application_id)}
                          className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md mr-2"
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
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Application Details</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-medium">{application.application_status}</p>
                              </div>
                            
                     
                            </div>
                          </div>

                        
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                   
                          <button
                            onClick={() => handleContactEmployer(application.posted_by_id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4CAF50] hover:bg-[#45a049]"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Employer
                          </button>
                        </div>



                        <div className="mt-6 flex flex-wrap gap-3">
                   
                   <button
                     onClick={() => handleCancelApplication(application.application_id)}
                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                   >
                     <XCircle className="h-4 w-4 mr-2" />
                     Cancel Application
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
    </div>
  )
}

