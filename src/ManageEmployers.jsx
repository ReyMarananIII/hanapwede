"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, Eye, Filter, X } from "lucide-react"
import AdminLayout from "./AdminLayout"
import { baseURL } from "./constants"
import Swal from "sweetalert2"

const AdminManageEmployersPage = () => {
  const [employers, setEmployers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployer, setSelectedEmployer] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [filterOptions, setFilterOptions] = useState({
    industry: "",
    location: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [industries, setIndustries] = useState([])
  const [locations, setLocations] = useState([])

  const itemsPerPage = 10

  useEffect(() => {
    fetchEmployers()
  }, [filterOptions])

  const fetchEmployers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("authToken")

      let url = `${baseURL}/api/admin/get-all-employers/`

      // Add filters if they exist
      if (filterOptions.industry) {
        url += `?industry=${filterOptions.industry}`
        if (filterOptions.location) {
          url += `&location=${filterOptions.location}`
        }
      } else if (filterOptions.location) {
        url += `?location=${filterOptions.location}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch employers")
      }

      const data = await response.json()
      setEmployers(data.results || data)
      console.log(data)

      // Extract unique industries and locations for filters
      const allIndustries = [...new Set((data.results || data).map((emp) => emp.industry).filter(Boolean))]
      const allLocations = [...new Set((data.results || data).map((emp) => emp.location).filter(Boolean))]
      setIndustries(allIndustries)
      setLocations(allLocations)
    } catch (error) {
      console.error("Error fetching employers:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load employers. Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredEmployers = employers.filter((employer) => {
    return (
      employer.comp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employer.industry && employer.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (employer.location && employer.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const handleViewEmployer = (employer) => {
    setSelectedEmployer(employer)
    setIsViewModalOpen(true)
  }



  const handleDeleteEmployer = async (employerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("authToken")
          const response = await fetch(`${baseURL}/api/admin/delete-employer/${employerId}/`, {
            method: "DELETE",
            headers: {
              Authorization: `Token ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error("Failed to delete employer")
          }

          // Remove the deleted employer from the state
          setEmployers(employers.filter((employer) => employer.user_id !== employerId))

          Swal.fire("Deleted!", "Employer has been deleted.", "success")
        } catch (error) {
          console.error("Error deleting employer:", error)
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete employer. Please try again later.",
          })
        }
      }
    })
  }

 
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilterOptions({
      ...filterOptions,
      [name]: value,
    })
  }

  const clearFilters = () => {
    setFilterOptions({
      industry: "",
      location: "",
    })
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Manage Employers</h1>
          <p className="text-gray-600">View, edit, and manage employer accounts in the system</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search employers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              {(filterOptions.industry || filterOptions.location) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Filter Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    name="industry"
                    value={filterOptions.industry}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Industries</option>
                    {industries.map((industry, index) => (
                      <option key={index} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    name="location"
                    value={filterOptions.location}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredEmployers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No employers found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployers.map((employer) => (
                      <tr key={employer.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{employer.comp_name}</div>
                          {employer.comp_site && (
                            <div className="text-sm text-indigo-600 hover:underline">
                              <a href={employer.comp_site} target="_blank" rel="noopener noreferrer">
                                Website
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employer.industry || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employer.location || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employer.contact_no || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewEmployer(employer)}
                              className="text-blue-600 hover:text-blue-900"
                              aria-label={`View ${employer.comp_name}`}
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                     
                            <button
                              onClick={() => handleDeleteEmployer(employer.user_id)}
                              className="text-red-600 hover:text-red-900"
                              aria-label={`Delete ${employer.comp_name}`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Results count */}
              <div className="mt-4 text-sm text-gray-700">
                Showing <span className="font-medium">{filteredEmployers.length}</span> results
              </div>
            </>
          )}
        </div>
      </div>

      {/* View Employer Modal */}
      {isViewModalOpen && selectedEmployer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Employer Details</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedEmployer.comp_name}</h3>
                  {selectedEmployer.comp_site && (
                    <a
                      href={selectedEmployer.comp_site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      {selectedEmployer.comp_site}
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Industry</p>
                    <p>{selectedEmployer.industry || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p>{selectedEmployer.location || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Number</p>
                    <p>{selectedEmployer.contact_no || "Not specified"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Company Description</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedEmployer.comp_desc || "No description provided."}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg"
                >
                  Close
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    
    </AdminLayout>
  )
}

export default AdminManageEmployersPage
