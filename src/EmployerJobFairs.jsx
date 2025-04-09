"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, Edit, Trash2, Plus, AlertCircle, Loader, Eye, Clock, Briefcase,FileText} from "lucide-react"
import JobFairCreationForm from "./JobFairCreationForm"
import EditJobFairForm from "./EditJobFairForm"
import { useNavigate } from "react-router-dom"

export default function EmployerJobFairs() {
  const [jobFairs, setJobFairs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedJobFair, setSelectedJobFair] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobFairs()
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
  
  
      const employerJobFairs = data
    
      setJobFairs(employerJobFairs)
    } catch (error) {
      console.error("Error fetching job fairs:", error)
      setError("Failed to load job fairs. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateJobFair = async (jobFairData) => {
    try {
      const token = localStorage.getItem("authToken")
   
      const response = await fetch("http://localhost:8000/api/jobfairs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(jobFairData),
      })

      if (!response.ok) {
        throw new Error("Failed to create job fair")
      }

      const newJobFair = await response.json()
      setJobFairs([...jobFairs, newJobFair])
      setShowCreateForm(false)
      return { success: true }
    } catch (error) {
      console.error("Error creating job fair:", error)
      return { success: false, error: error.message }
    }
  }

  const handleUpdateJobFair = async (jobFairId, updatedData) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`http://localhost:8000/api/jobfairs/${jobFairId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update job fair")
      }

      const updatedJobFair = await response.json()
      setJobFairs(jobFairs.map((jf) => (jf.id === jobFairId ? updatedJobFair : jf)))
      setShowEditForm(false)
      setSelectedJobFair(null)
      return { success: true }
    } catch (error) {
      console.error("Error updating job fair:", error)
      return { success: false, error: error.message }
    }
  }

  const handleDeleteJobFair = async () => {
    if (!selectedJobFair) return

    setIsDeleting(true)
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`http://localhost:8000/api/jobfairs/${selectedJobFair.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete job fair")
      }

      setJobFairs(jobFairs.filter((jf) => jf.id !== selectedJobFair.id))
      setShowDeleteConfirm(false)
      setSelectedJobFair(null)
    } catch (error) {
      console.error("Error deleting job fair:", error)
      alert("Failed to delete job fair. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }



  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Your Job Fairs</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Job Fair
        </button>
      </div>

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
          <h2 className="text-xl font-semibold mb-2">No Job Fairs Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't created any job fairs yet. Create your first job fair to attract qualified candidates.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Job Fair
          </button>
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
                <button
                  onClick={() => {
                    setSelectedJobFair(jobFair)
                    setShowEditForm(true)
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>

                <button
                  onClick={() => navigate(`/job-fairs/${jobFair.id}/applications`)}
                  className="text-green-600 hover:text-green-800 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Details
                </button>
       
                <button
                  onClick={() => {
                    setSelectedJobFair(jobFair)
                    setShowDeleteConfirm(true)
                  }}
                  className="text-red-600 hover:text-red-800 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Job Fair Modal */}
      {showCreateForm && (
        <JobFairCreationForm onClose={() => setShowCreateForm(false)} onSubmit={handleCreateJobFair} />
      )}

      {/* Edit Job Fair Modal */}
      {showEditForm && selectedJobFair && (
        <EditJobFairForm
          jobFair={selectedJobFair}
          onClose={() => {
            setShowEditForm(false)
            setSelectedJobFair(null)
          }}
          onSubmit={(updatedData) => handleUpdateJobFair(selectedJobFair.id, updatedData)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedJobFair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Job Fair</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the job fair "{selectedJobFair.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setSelectedJobFair(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJobFair}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                ) : (
                  <Trash2 className="-ml-1 mr-2 h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

