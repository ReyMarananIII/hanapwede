"use client"

import { useEffect, useState } from "react"
import { baseURL } from "./constants"
import LoggedInHeader from "./LoggedInHeader"
import { useNavigate } from "react-router-dom"
import {
  CheckCircle,
  XCircle,
  Eye,
  Briefcase,
  MapPin,
  Clock,
  User,
  AlertCircle,
  Loader,
  Edit,
  Trash2,
  Search,
  FileText
} from "lucide-react"

export default function EmployerDashboard() {
  const navigate = useNavigate()
  const authToken = localStorage.getItem("authToken")
  const [dashboardData, setDashboardData] = useState({
    active_jobs_count: 0,
    total_applications: 0,
    applicants: [],
    job_posts: [],
  })

  // Modal states for applicant actions
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("") // "approve", "decline", "view"
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionMessage, setActionMessage] = useState({ type: "", message: "" })
  const [searchTerm, setSearchTerm] = useState("")
    const [resume, setResume] = useState(null)
  // Modal states for job deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isJobProcessing, setIsJobProcessing] = useState(false)
  const [jobActionMessage, setJobActionMessage] = useState({ type: "", message: "" })
 
  const categories = Array.from(
    new Set(dashboardData.job_posts.map((job) => job.category).filter(Boolean))
  );
const [selectedCategories, setSelectedCategories] = useState([]);
  
useEffect(() => {
    fetchDashboardData()
  }, [authToken])

  const filteredJobPosts = dashboardData.job_posts.filter((job) => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(job.category);
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (category) => {
  setSelectedCategories((prev) =>
    prev.includes(category)
      ? prev.filter((c) => c !== category)
      : [...prev, category]
  );
};
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${baseURL}/api/employer-dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    }
  }


  useEffect(() => {
    if (!selectedApplicant) return;
  
    const token = localStorage.getItem("authToken");
  
    fetch(`${baseURL}/api/get-user-details/${selectedApplicant.applicant__id}/`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applicant details");
        return res.json();
      })
      .then((data) => {
        const profile = data.profile;
        setResume(profile.employee_resume || null);
        // Optionally set other data too
      })
      .catch((err) => {
        console.error("Error fetching applicant resume:", err);
      });
  }, [selectedApplicant]);

  const handleDeleteApplication = async () => {
    if (!selectedApplicant) return;
  
    setIsProcessing(true);
    setActionMessage({ type: "", message: "" });
  
    try {
      const response = await fetch(
        `${baseURL}/api/delete-application/${selectedApplicant.application_id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete application");
      }
  
      setDashboardData((prev) => ({
        ...prev,
        applicants: prev.applicants.filter(
          (app) => app.application_id !== selectedApplicant.application_id
        ),
      }));
  
      setActionMessage({
        type: "success",
        message: "Application deleted successfully!",
      });
  
      setTimeout(() => {
         closeModal();
        fetchDashboardData();
      }, 1000);
    } catch (error) {
      console.error("Error deleting application:", error);
      setActionMessage({
        type: "error",
        message: "Failed to delete application. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  // end of delete application functions
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
        `${baseURL}/api/applications/${selectedApplicant.application_id}/approve/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to approve application")
      }

      // Update local state to reflect the change
      setDashboardData((prev) => ({
        ...prev,
        applicants: prev.applicants.map((app) =>
          app.application_id === selectedApplicant.application_id ? { ...app, application_status: "Approved" } : app,
        ),
      }))

      setActionMessage({
        type: "success",
        message: "Application approved successfully! The candidate will be notified.",
      })

      // Close modal after a delay
      setTimeout(() => {
        closeModal()
        // Refresh data
        fetchDashboardData()
      }, 1000)
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
        `${baseURL}/api/applications/${selectedApplicant.application_id}/decline/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to decline application")
      }

      // Update local state to reflect the change
      setDashboardData((prev) => ({
        ...prev,
        applicants: prev.applicants.map((app) =>
          app.application_id === selectedApplicant.application_id ? { ...app, application_status: "Declined" } : app,
        ),
      }))

      setActionMessage({
        type: "success",
        message: "Application declined. The candidate will be notified.",
      })

      // Close modal after a delay
      setTimeout(() => {
        closeModal()
        // Refresh data
        fetchDashboardData()
      }, 1000)
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

  // Open delete confirmation modal
  const openDeleteModal = (job) => {
    setSelectedJob(job)
    setShowDeleteModal(true)
    setJobActionMessage({ type: "", message: "" })
  }

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedJob(null)
    setIsJobProcessing(false)
    setJobActionMessage({ type: "", message: "" })
  }

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!selectedJob) return

    setIsJobProcessing(true)
    setJobActionMessage({ type: "", message: "" })

    try {
      const response = await fetch(`${baseURL}/api/delete-job/${selectedJob.post_id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete job posting")
      }

      // Update local state to reflect the change
      setDashboardData((prev) => ({
        ...prev,
        job_posts: prev.job_posts.filter((job) => job.post_id !== selectedJob.post_id),
        active_jobs_count: prev.active_jobs_count - 1,
      }))

      setJobActionMessage({
        type: "success",
        message: "Job posting deleted successfully!",
      })

      // Close modal after a delay
      setTimeout(() => {
        closeDeleteModal()
        // Refresh data
        fetchDashboardData()
      }, 1000)
    } catch (error) {
      console.error("Error deleting job:", error)
      setJobActionMessage({
        type: "error",
        message: "Failed to delete job posting. Please try again.",
      })
    } finally {
      setIsJobProcessing(false)
    }
  }

  // Navigate to edit job page
  const navigateToEditJob = (jobId) => {
    navigate(`/employer/edit-job/${jobId}`)
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

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {/*<LoggedInHeader />*/}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/employer/post-job")}
              className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049] flex items-center justify-center w-full sm:w-auto"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Post New Job
            </button>
            <button
                onClick={() => navigate("/employer/dashboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto"
            >
              <Eye className="w-4 h-4 mr-2" />
              Full Dashboard
            </button>
          </div>

       
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
     
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              List of Applicants
            </h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-600">Name</th>
                    <th className="text-left p-4 font-medium text-gray-600">Skills</th>
                    <th className="text-left p-4 font-medium text-gray-600">Experience</th>
                    <th className="text-left p-4 font-medium text-gray-600">Location</th>

                    <th className="text-left p-4 font-medium text-gray-600">Status</th>
                    <th className="text-left p-4 font-medium text-gray-600">Contact</th>
                    <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.applicants.length > 0 ? (
                    dashboardData.applicants.map((candidate, index) => (
                      <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="p-4 font-medium">{candidate.applicant_name}</td>
                        <td className="p-4">{candidate.applicant_skills}</td>
                        <td className="p-4">{candidate.applicant_experience}</td>
                        <td className="p-4">
                      
                          {candidate.applicant_location}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(candidate.application_status)}`}
                          >
                            {candidate.application_status || "Pending"}
                          </span>
                        </td>
                        <td className="p-4">{candidate.applicant__employeeprofile__contact_no || "N/A"}</td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openModal("view", candidate)}
                              className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {candidate.application_status === "Pending" && (
                              <>
                                <button
                                  onClick={() => openModal("approve", candidate)}
                                  className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                                  title="Approve Application"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openModal("decline", candidate)}
                                  className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                  title="Decline Application"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openModal("delete", candidate)}
                                  className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                  title="Delete Application"
                                >
                                  
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-6 text-gray-500">
                        <div className="flex flex-col items-center">
                          <User className="w-8 h-8 text-gray-300 mb-2" />
                          <p>No applications yet</p>
                          <p className="text-sm mt-1">When candidates apply to your jobs, they'll appear here</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

      
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-[#E8F5E9] p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600">Active Jobs</div>
                <div className="text-2xl font-bold text-[#2E7D32] flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-[#2E7D32]" />
                  {dashboardData.active_jobs_count}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Applications</div>
                <div className="text-2xl font-bold flex items-center text-blue-600">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  {dashboardData.total_applications}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-12 px-4 sm:px-6 lg:px-8">
<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
  <h2 className="text-lg font-semibold flex items-center">
    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
    Current Job Postings
  </h2>

  <div className="relative w-full md:w-64">
    <input
      type="text"
      placeholder="Search job titles..."
      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
  </div>
</div>

<div className="mb-4">
  <p className="font-medium text-sm text-gray-700 mb-2">Filter by Category:</p>
  <div className="flex flex-wrap gap-3">
    {categories.map((cat) => (
      <label key={cat} className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={selectedCategories.includes(cat)}
          onChange={() => handleCategoryChange(cat)}
          className="form-checkbox h-4 w-4 text-blue-600"
        />
        <span className="text-sm text-gray-700">{cat}</span>
      </label>
    ))}
  </div>
</div>
  <div className="bg-white rounded-lg shadow overflow-x-auto ">
  <div className="max-h-[500px] overflow-y-auto ">
    <table className="w-full">
      <thead>
        <tr className="border-b bg-gray-50">
          <th className="text-left p-4 font-medium text-gray-600">Title</th>
          <th className="text-left p-4 font-medium text-gray-600">Category</th>
          <th className="text-left p-4 font-medium text-gray-600">Location</th>
          <th className="text-left p-4 font-medium text-gray-600">Skills Required</th>
          <th className="text-left p-4 font-medium text-gray-600">Salary</th>
          <th className="text-left p-4 font-medium text-gray-600">Posted On</th>
          <th className="text-left p-4 font-medium text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredJobPosts.length > 0 ? (
          filteredJobPosts.map((job, index) => (
            <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
              <td className="p-4 font-medium">{job.job_title}</td>
              <td className="p-4">{job.category || "N/A"}</td>
              <td className="p-4 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                {job.location || "N/A"}
              </td>
              <td className="p-4">{job.skills_req || "N/A"}</td>
              <td className="p-4">{job.salary_range ? `₱${job.salary_range}` : "Negotiable"}</td>
              <td className="p-4 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                {new Date(job.created_at).toLocaleDateString()}
              </td>
              <td className="p-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateToEditJob(job.post_id)}
                    className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    title="Edit Job"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(job)}
                    className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center p-6 text-gray-500">
              <div className="flex flex-col items-center">
                <Briefcase className="w-8 h-8 text-gray-300 mb-2" />
                <p>No job postings yet</p>
                <p className="text-sm mt-1">Click "Post New Job" to create your first job listing</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  </div>
</div>
      </div>

      {/* Modal for application actions */}
      {showModal && (
         <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === "view" && "Applicant Details"}
                {modalType === "approve" && "Approve Application"}
                {modalType === "decline" && "Decline Application"}
                {modalType === "delete" && "Delete Application"}
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
                      <p className="text-sm text-gray-500">{selectedApplicant.applicant_role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{selectedApplicant.applicant_experience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedApplicant.applicant_location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedApplicant.application_status)}`}
                      >
                        {selectedApplicant.application_status || "Pending"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Applied For</p>
                      <p className="font-medium">{selectedApplicant.job_post__job_title || "N/A"}</p>
                    </div>
                  </div>

                  {modalType === "view" && (
                 <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                   <FileText className="w-4 h-4 mr-2 text-gray-500" />
                   Resume
                 </label>
                 <div className="mt-1 p-6 border border-gray-300 border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                   {resume ? (
                     <div className="text-center">
                       <FileText className="w-12 h-12 text-green-600 mx-auto mb-2" />
                       <p className="text-sm text-gray-700 mb-2">Resume uploaded</p>
                       <a
                        href={`${baseURL}${resume}`}


                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center justify-center"
                       >
                         <Eye className="w-4 h-4 mr-1" />
                         View Resume
                       </a>
                     </div>
                   ) : (
                     <div className="text-center">
                       <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                       <p className="text-gray-500">No resume uploaded.</p>
                       <p className="text-sm text-gray-500 mt-1">Please update your profile to add a resume.</p>
                     </div>
                   )}
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

{modalType === "delete" && (
                    <div className="mt-4">
                      <p className="text-gray-700">
                        Are you sure you want to delete this application? This action cannot be undone.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={closeModal}
                disabled={isProcessing}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {modalType === "view" ? "Close" : "Cancel"}
              </button>

              {modalType === "approve" && (
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
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
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
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
              {modalType === "delete" && (
                <button
                  onClick={handleDeleteApplication}
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
                      <Trash2 className="-ml-1 mr-2 h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Confirmation Modal */}
      {showDeleteModal && selectedJob && (
         <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Delete Job Posting</h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {jobActionMessage.type && (
                <div
                  className={`mb-4 p-3 rounded ${
                    jobActionMessage.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="flex">
                    {jobActionMessage.type === "success" ? (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    <p>{jobActionMessage.message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedJob.job_title}</h4>
                    <p className="text-sm text-gray-500">{selectedJob.category || "No category"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700">
                    Are you sure you want to delete this job posting? This action cannot be undone.
                  </p>
                  <div className="bg-gray-50 p-3 rounded mt-3">
                    <p className="text-sm font-medium text-gray-700">Job details:</p>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      <li>Location: {selectedJob.location || "N/A"}</li>
                      <li>Salary: {selectedJob.salary_range ? `₱${selectedJob.salary_range}` : "Negotiable"}</li>
                      <li>Posted on: {new Date(selectedJob.created_at).toLocaleDateString()}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={closeDeleteModal}
                disabled={isJobProcessing}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteJob}
                disabled={isJobProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isJobProcessing ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Trash2 className="-ml-1 mr-2 h-4 w-4" />
                    Delete Job
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
