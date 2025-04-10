"use client"

import { useState, useEffect } from "react"
import { baseURL } from './constants';
import AdminLayout from "./AdminLayout"
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  Loader,
  Clock,
  Flag,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function AdminReportsPage() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all") // all, post, comment
  const [filterStatus, setFilterStatus] = useState("all") // all, pending, resolved, dismissed
  const [sortBy, setSortBy] = useState("newest")
  const [expandedReport, setExpandedReport] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  const [showContentModal, setShowContentModal] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)

  // Fetch reports when component mounts
  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`${baseURL}/api/admin/reports/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch reports")
      }

      const data = await response.json()

      
      setReports(data)
    } catch (error) {
      console.error("Error fetching reports:", error)
      setError(error.message || "Failed to load reports")
    } finally {
      setIsLoading(false)
    }
  }

  const refreshReports = async () => {
    setIsRefreshing(true)
    await fetchReports()
    setIsRefreshing(false)
  }

  const handleResolveReport = async (reportId) => {
    setProcessingId(reportId)
    setIsProcessing(true)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${baseURL}/api/admin/reports/${reportId}/resolve/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to resolve report")
      }

      // Update the report status in the local state
      setReports(
        reports.map((report) =>
          report.id === reportId ? { ...report, status: "resolved", resolved_at: new Date().toISOString() } : report,
        ),
      )
    } catch (error) {
      console.error("Error resolving report:", error)
      alert("Failed to resolve report. Please try again.")
    } finally {
      setIsProcessing(false)
      setProcessingId(null)
    }
  }

  const handleDismissReport = async (reportId) => {
    setProcessingId(reportId)
    setIsProcessing(true)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${baseURL}/api/admin/reports/${reportId}/dismiss/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to dismiss report")
      }

      // Update the report status in the local state
      setReports(
        reports.map((report) =>
          report.id === reportId ? { ...report, status: "dismissed", dismissed_at: new Date().toISOString() } : report,
        ),
      )
    } catch (error) {
      console.error("Error dismissing report:", error)
      alert("Failed to dismiss report. Please try again.")
    } finally {
      setIsProcessing(false)
      setProcessingId(null)
    }
  }

  const handleDeleteContent = async (reportId, contentType, contentId) => {
    setProcessingId(reportId)
    setIsProcessing(true)

    try {
      const token = localStorage.getItem("authToken")
      const endpoint =
        contentType === "post"
          ? `${baseURL}/api/admin/posts/${contentId}/`
          : `${baseURL}/api/admin/comments/${contentId}/`

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete ${contentType}`)
      }

      // Update the report status in the local state
      setReports(
        reports.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: "resolved",
                resolved_at: new Date().toISOString(),
                content_deleted: true,
              }
            : report,
        ),
      )

      alert(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} has been deleted successfully.`)
    } catch (error) {
      console.error(`Error deleting ${contentType}:`, error)
      alert(`Failed to delete ${contentType}. Please try again.`)
    } finally {
      setIsProcessing(false)
      setProcessingId(null)
    }
  }

  const toggleExpandReport = (id) => {
    setExpandedReport(expandedReport === id ? null : id)
  }

  const viewReportedContent = (content) => {
    setSelectedContent(content)
    setShowContentModal(true)
  }


  const filteredReports = reports
    .filter((report) => {

      const matchesSearch =
        report.reported_by_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.report_desc?.toLowerCase().includes(searchTerm.toLowerCase())

    
      const matchesType =
        filterType === "all" || (filterType === "post" && report.post) || (filterType === "comment" && report.comment)


      const matchesStatus = filterStatus === "all" || report.status === filterStatus

      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at)
      } else {
        return new Date(a.created_at) - new Date(b.created_at)
      }
    })

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "dismissed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Get reason badge color
  const getReasonBadge = (reason) => {
    switch (reason?.toLowerCase()) {
      case "spam":
        return "bg-blue-100 text-blue-800"
      case "inappropriate":
        return "bg-red-100 text-red-800"
      case "harassment":
        return "bg-purple-100 text-purple-800"
      case "other":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center mb-4 md:mb-0">
            <Flag className="mr-2 h-6 w-6 text-indigo-600" />
            Reported Content Management
          </h1>
          <button
            onClick={refreshReports}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isRefreshing ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh Reports
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Content</option>
                  <option value="post">Posts Only</option>
                  <option value="comment">Comments Only</option>
                </select>
              </div>

              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 text-indigo-500 animate-spin mr-3" />
              <p className="text-gray-600">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Flag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "No reports match your current filters"
                  : "There are no content reports at this time"}
              </p>
              {(searchTerm || filterType !== "all" || filterStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterType("all")
                    setFilterStatus("all")
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <div key={report.id} className="hover:bg-gray-50 transition-colors">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="hidden sm:flex h-10 w-10 rounded-full bg-red-100 flex-shrink-0 mr-4 items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                              <h3 className="font-medium text-lg">
                                Report #{report.id} - {report.post ? "Post" : "Comment"} Report
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                  report.status,
                                )} mt-1 sm:mt-0 sm:ml-2`}
                              >
                                {getStatusIcon(report.status)}
                                <span className="ml-1 capitalize">{report.status}</span>
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReasonBadge(
                                  report.reason,
                                )} mt-1 sm:mt-0 sm:ml-2`}
                              >
                                {report.reason}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              Reported by <span className="font-medium">{report.reported_by_username}</span> on{" "}
                              {formatDate(report.created_at)}
                            </p>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-1">{report.report_desc}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mt-4 md:mt-0">
                        <button
                          onClick={() => toggleExpandReport(report.id)}
                          className="flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md mr-2"
                        >
                          {expandedReport === report.id ? (
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
                    {expandedReport === report.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Report Details</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div>
                                <p className="text-sm text-gray-500">Reason</p>
                                <p className="font-medium capitalize">{report.reason}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="text-gray-700">{report.report_desc}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Reported On</p>
                                <p className="font-medium">{formatDate(report.created_at)}</p>
                              </div>
                              {report.status === "resolved" && report.resolved_at && (
                                <div>
                                  <p className="text-sm text-gray-500">Resolved On</p>
                                  <p className="font-medium">{formatDate(report.resolved_at)}</p>
                                </div>
                              )}
                              {report.status === "dismissed" && report.dismissed_at && (
                                <div>
                                  <p className="text-sm text-gray-500">Dismissed On</p>
                                  <p className="font-medium">{formatDate(report.dismissed_at)}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Reported Content</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                              <div>
                                <p className="text-sm text-gray-500">Content Type</p>
                                <p className="font-medium capitalize">{report.post ? "Post" : "Comment"}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Content Preview</p>
                                <div className="mt-1 p-3 bg-white border border-gray-200 rounded-md">
                                  <p className="text-gray-700 line-clamp-3">
                                    {report.content_deleted ? (
                                      <span className="italic text-gray-500">Content has been deleted</span>
                                    ) : (
                                        (report.comment_content || report.post_content || "No preview available").slice(0, 100)

                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    viewReportedContent({
                                      type: report.post ? "post" : "comment",
                                      id: report.post || report.comment,
                                      content: report.comment_content || report.post_content,
                                      author: report.comment_author || report.post_author,
                                      created_at: report.created_at,
                                      deleted: report.content_deleted,
                                    })
                                  }
                                  disabled={report.content_deleted}
                                  className="text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Full Content
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {report.status === "pending" && (
                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              onClick={() => handleDismissReport(report.id)}
                              disabled={isProcessing && processingId === report.id}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isProcessing && processingId === report.id ? (
                                <Loader className="animate-spin h-4 w-4 mr-2" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              Dismiss Report
                            </button>
                            <button
                              onClick={() => handleResolveReport(report.id)}
                              disabled={isProcessing && processingId === report.id}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isProcessing && processingId === report.id ? (
                                <Loader className="animate-spin h-4 w-4 mr-2" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Resolve Report
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteContent(
                                  report.id,
                                  report.post ? "post" : "comment",
                                  report.post || report.comment,
                                )
                              }
                              disabled={(isProcessing && processingId === report.id) || report.content_deleted}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isProcessing && processingId === report.id ? (
                                <Loader className="animate-spin h-4 w-4 mr-2" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                              )}
                              Delete Content
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content View Modal */}
      {showContentModal && selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 capitalize">Reported {selectedContent.type}</h3>
              <button onClick={() => setShowContentModal(false)} className="text-gray-400 hover:text-gray-500">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {selectedContent.deleted ? (
                <div className="flex items-center justify-center p-8 text-gray-500 italic">
                  This content has been deleted
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Content Author: {selectedContent.author}</span>
                      <span className="text-sm text-gray-500">{formatDate(selectedContent.created_at)}</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">Content Preview</span>
                      <p className="text-gray-700 whitespace-pre-line">{selectedContent.content}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowContentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

