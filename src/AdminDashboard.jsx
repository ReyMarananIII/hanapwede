"use client"

import { useState, useEffect } from "react"
import { baseURL } from './constants';
import Swal from 'sweetalert2'
import {
  Users,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Loader,
  UserCheck,
  UserX,
  Clock,
  BadgeCheck,
} from "lucide-react"

export default function AdminDashboard() {
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
  const [pendingUsers, setPendingUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all") // all, employee, employer
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  const [pwdCardImage, setPwdCardImage] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(null)

  // Fetch pending users
  useEffect(() => {
    const fetchPendingUsers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch(`${baseURL}/api/admin/pending-users/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch pending users")
        }

        const data = await response.json()
    
        setPendingUsers(data)
      } catch (error) {
        console.error("Error fetching pending users:", error)
        setError("Failed to load pending users. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingUsers()
  }, [])

  // Filter and search users
  const filteredUsers = pendingUsers.filter((user) => {
    const matchesSearch =
      user.ID_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_disability.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  // Handle user approval
  const handleApproveUser = async (userId) => {
    setProcessingId(userId)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${baseURL}/api/admin/approve-user/${userId}/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to approve user")
      }

      // Update the local state to reflect the approval
      setPendingUsers(pendingUsers.filter((user) => user.user !== userId))

      if (showUserDetails && selectedUser && selectedUser.user === userId) {
        setShowUserDetails(false)
        setSelectedUser(null)
      }
    } catch (error) {
      console.error("Error approving user:", error)
      handleError("Failed to approve user. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  // Handle user rejection
  const handleRejectUser = async (userId) => {
    setProcessingId(userId)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${baseURL}/api/admin/reject-user/${userId}/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to reject user")
      }

      // Update the local state to reflect the rejection
      setPendingUsers(pendingUsers.filter((user) => user.user !== userId))

      if (showUserDetails && selectedUser && selectedUser.user === userId) {
        setShowUserDetails(false)
        setSelectedUser(null)
      }
    } catch (error) {
      console.error("Error rejecting user:", error)
      handleError("Failed to reject user. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  // Fetch PWD card image
  const fetchPwdCardImage = async (userId) => {
    setImageLoading(true)
    setImageError(null)
    setPwdCardImage(null)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${baseURL}/api/retrieve-card/${userId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch PWD card image")
      }

      const data = await response.json()
      setPwdCardImage(data.image)
    } catch (error) {
      console.error("Error fetching PWD card image:", error)
      setImageError("Failed to load PWD card image. The user may not have uploaded one.")
    } finally {
      setImageLoading(false)
    }
  }

  // View user details
  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setShowUserDetails(true)
    fetchPwdCardImage(user.user)
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      {/*<header className="bg-indigo-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center">
              <BadgeCheck className="mr-2 h-6 w-6" />
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Admin User</span>
              <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>*/}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">User Registration Approval</h2>
          <p className="text-gray-600">Review and approve new user registrations to activate their accounts</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 mr-2">Filter:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Users</option>
                  <option value="employee">Job Seekers</option>
                  <option value="employer">Employers</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
                {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* User List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading pending users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No pending users</h3>
              <p className="text-gray-500 text-center max-w-md">
                There are no pending user registrations that require approval at this time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User ID
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Disability Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.user} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-700 font-medium">{user.ID_no.slice(0, 2)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">ID: {user.ID_no}</div>
                            <div className="text-sm text-gray-500">User #{user.user}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {user.username}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {user.user_disability}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {user.location || "Location not set"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.activated ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.activated ? "Activated" : "Pending Approval"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApproveUser(user.user)}
                            disabled={processingId === user.user}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded-md disabled:opacity-50"
                          >
                            {processingId === user.user ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRejectUser(user.user)}
                            disabled={processingId === user.user}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
    <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300 ease-out">

          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">User Details</h3>
              <button onClick={() => setShowUserDetails(false)} className="text-gray-400 hover:text-gray-500">
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <span className="text-indigo-700 text-xl font-medium">{selectedUser.ID_no.slice(0, 2)}</span>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-900">ID: {selectedUser.ID_no}</h4>
                  <p className="text-gray-500">User #{selectedUser.user}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-1">Disability Type</h5>
                  <p className="text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {selectedUser.user_disability}
                    </span>
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Additional Information</h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-xs font-medium text-gray-500 mb-1">ID Number</h6>
                      <p className="text-gray-900">{selectedUser.ID_no}</p>
                    </div>

                    <div>
                      <h6 className="text-xs font-medium text-gray-500 mb-1">Location</h6>
                      <p className="text-gray-900">{selectedUser.location || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">PWD Card Verification</h5>

                {imageLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading PWD card image...</span>
                  </div>
                ) : imageError ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">{imageError}</p>
                      </div>
                    </div>
                  </div>
                ) : pwdCardImage ? (
                  <div className="flex flex-col items-center">
                    <img
                     src={`${baseURL}${pwdCardImage}` || "/placeholder.svg"}
                      alt="PWD Card"
                      className="max-w-full h-auto max-h-96 rounded-lg border border-gray-200 shadow-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">PWD Card Image</p>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-200 p-3 mb-2">
                      <AlertCircle className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-center">No PWD card image available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUserDetails(false)
                  setSelectedUser(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
              <button
                onClick={() => handleRejectUser(selectedUser.user)}
                disabled={processingId === selectedUser.user}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {processingId === selectedUser.user ? (
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                ) : (
                  <UserX className="-ml-1 mr-2 h-4 w-4" />
                )}
                Reject
              </button>
              <button
                onClick={() => handleApproveUser(selectedUser.user)}
                disabled={processingId === selectedUser.user}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {processingId === selectedUser.user ? (
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                ) : (
                  <UserCheck className="-ml-1 mr-2 h-4 w-4" />
                )}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
