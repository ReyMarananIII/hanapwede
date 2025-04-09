"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import {
  Bell,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Trash2,
  AlertCircle,
  Loader,
  ArrowLeft,
  CheckCheck,
} from "lucide-react"

export default function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all") // all, read, unread
  const [sortOrder, setSortOrder] = useState("newest") // newest, oldest
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://194.163.40.84/api/get-notifications/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Failed to load notifications. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`http://194.163.40.84/api/mark-notification-read/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ is_read: true }),
      })

      if (response.ok) {
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, is_read: true } : notification,
          ),
        )
      } else {
        console.error("Failed to mark notification as read")
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setIsMarkingAll(true)
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://194.163.40.84/api/mark-all-notifications-read/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        setNotifications(
          notifications.map((notification) => ({
            ...notification,
            is_read: true,
          })),
        )
      } else {
        console.error("Failed to mark all notifications as read")
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    } finally {
      setIsMarkingAll(false)
    }
  }

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`http://194.163.40.84/api/delete-notification/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        setNotifications(notifications.filter((notification) => notification.id !== id))
      } else {
        console.error("Failed to delete notification")
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  // Delete all notifications
  const deleteAllNotifications = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://194.163.40.84/api/delete-all-notifications/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        setNotifications([])
      } else {
        console.error("Failed to delete all notifications")
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter((notification) => {
      // Filter by search term
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.action.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by read/unread status
      const matchesFilter =
        filterType === "all" ||
        (filterType === "read" && notification.is_read) ||
        (filterType === "unread" && !notification.is_read)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      // Sort by timestamp
      if (sortOrder === "newest") {
        return new Date(b.timestamp) - new Date(a.timestamp)
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp)
      }
    })

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold flex items-center">
            <Bell className="mr-2 h-6 w-6 text-[#4CAF50]" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                >
                  <option value="all">All</option>
                  <option value="read">Read</option>
                  <option value="unread">Unread</option>
                </select>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={markAllAsRead}
                disabled={isMarkingAll || unreadCount === 0}
                className="flex items-center px-3 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-[#45a049] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isMarkingAll ? (
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <CheckCheck className="h-4 w-4 mr-2" />
                )}
                Mark all as read
              </button>

              <button
                onClick={deleteAllNotifications}
                disabled={isDeleting || notifications.length === 0}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Clear all
              </button>
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

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 text-[#4CAF50] animate-spin mr-3" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm || filterType !== "all"
                  ? "No notifications match your current filters"
                  : "You don't have any notifications yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? "bg-blue-50 hover:bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div
                          className={`w-2 h-2 mt-2 mr-3 rounded-full flex-shrink-0 ${
                            notification.is_read ? "bg-gray-300" : "bg-[#4CAF50]"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <span className="text-xs text-gray-500 ml-4">{formatDate(notification.timestamp)}</span>
                          </div>
                          <p className="text-gray-600">{notification.action}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start ml-4 space-x-2">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete notification"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        {filteredNotifications.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

