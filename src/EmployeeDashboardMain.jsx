"use client"

import { useState, useEffect } from "react"
import LoggedInHeader from "./LoggedInHeader"
import { useNavigate } from "react-router-dom"
import { baseURL } from './constants';
import ForumPage from "./ForumPage"
import {
  Users,
  Briefcase,
  FileText,
  Accessibility,
  Eye,
  Brain,
  Ear,
  ShipWheelIcon as Wheelchair,
  Search,
  Building,
  MapPin,
  MessageSquare,
  Loader,
} from "lucide-react"

export default function EmployeeDashboardMain() {
  const [location, setLocation] = useState("")
  const [jobTerm,setJobTerm] = useState("")
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("recommended")
  const [allJobs, setAllJobs] = useState([])


  const [selectedCategories, setSelectedCategories] = useState([]);
  // New state for statistics
  const [statistics, setStatistics] = useState({
    employeeCount: 0,
    employerCount: 0,
    jobsPostedCount: 0,
    disabilityTypes: [],
  })
  const [statsLoading, setStatsLoading] = useState(true)

  const userId = localStorage.getItem("userId")
  const authToken = localStorage.getItem("authToken")
  const navigate = useNavigate()

  const handleChat = async (employerId) => {
    try {
      const response = await fetch(`${baseURL}/api/create_chat/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${authToken}`,
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
    }
  }

  // Fetch recommended jobs
  useEffect(() => {
    if (!authToken) {
      setError("Authentication token not found.")
      setLoading(false)
      return
    }

    fetch(`${baseURL}/api/recommend_jobs/?user_id=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs")
        }
        return response.json()
      })
      .then((data) => {
        setJobs(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error)
        setError(error.message)
        setLoading(false)
      })
  }, [authToken, userId])

  // Fetch all jobs when tab changes
  useEffect(() => {
    if (activeTab === "all") {
      fetch(`${baseURL}/api/all-jobs/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${authToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setAllJobs(data))
        .catch((error) => console.error("Error fetching all jobs:", error))
    }
  }, [activeTab, authToken])

  // Fetch statistics
 

  // Get disability icon based on type
  const getDisabilityIcon = (type) => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("visual") || lowerType.includes("sight") || lowerType.includes("blind")) {
      return <Eye className="h-5 w-5 text-purple-600" />
    } else if (lowerType.includes("hearing") || lowerType.includes("deaf")) {
      return <Ear className="h-5 w-5 text-purple-600" />
    } else if (lowerType.includes("physical") || lowerType.includes("mobility")) {
      return <Wheelchair className="h-5 w-5 text-purple-600" />
    } else if (lowerType.includes("cognitive") || lowerType.includes("learning")) {
      return <Brain className="h-5 w-5 text-purple-600" />
    } else {
      return <Accessibility className="h-5 w-5 text-purple-600" />
    }
  }
  const jobList = Array.isArray(activeTab === "recommended" ? jobs : allJobs)
  ? (activeTab === "recommended" ? jobs : allJobs)
  : [];
  const categories = Array.from(
    new Set(jobList.map((job) => job.category).filter(Boolean))
  );

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  const filteredJobs = jobList.filter((job) => {
    const matchesTitle = jobTerm
      ? job.job_title?.toLowerCase().includes(jobTerm.toLowerCase())
      : true;
  
    const matchesCategory =
      activeTab === "all"
        ? selectedCategories.length === 0 || selectedCategories.includes(job.category)
        : true;
  
    return matchesTitle && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Job Feed</h1>

       
      

        <div className="flex gap-4 mb-6 border-b">
          <button
            className={`pb-2 ${activeTab === "recommended" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"}`}
            onClick={() => setActiveTab("recommended")}
          >
            Recommended Jobs
          </button>
          <button
            className={`pb-2 ${activeTab === "all" ? "border-b-2 border-blue-600 font-semibold" : "text-gray-500"}`}
            onClick={() => setActiveTab("all")}
          >
            All Jobs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-h-[500px] overflow-y-auto">

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                  Job Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Job Title"
                    value={jobTerm}
                    onChange={(e) => setJobTerm(e.target.value)}
                    className="w-full p-2 pl-8 border rounded-md"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div>
            <h3 className="text-md font-medium mb-3 flex items-center mt-6 text-gray-500">
              <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
              Job Applications
            </h3>
            <button
              onClick={() => navigate(`/job-seeker/track-job`)}
              className="bg-[#7cd1ed] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex mt-5 items-center"
            >
              Track Applications
            </button>
          </div>

          {activeTab === "all" && categories.length > 0 && (
  <div className="mb-4 mt-6">
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
)}
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-gray-500 mb-4">
              {activeTab === "recommended" ? "Recommended for You" : "All Available Jobs"}
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (activeTab === "recommended" ? jobs : allJobs).length === 0 ? (
              <p className="text-gray-500">No jobs available.</p>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">{job.job_title}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Building className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{job.comp_name || "Unknown Company"}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{job.location || "Location not specified"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.tags?.split(", ").map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex mt-3 flex-wrap gap-2">
                      {job.disabilitytag?.split(", ").map((disabilitytag, disabilitytagIndex) => (
                        <span
                          key={disabilitytagIndex}
                          className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full flex items-center"
                        >
                          <Accessibility className="h-3 w-3 mr-1" />
                          {disabilitytag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => navigate(`/job-seeker/apply?post_id=${job.post_id}`)}
                        className="bg-[#7cd1ed] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Apply Now
                      </button>
                      <button
                        onClick={() => handleChat(job.posted_by)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat with Employer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/*<ForumPage />*/}
    </div>
  )
}

