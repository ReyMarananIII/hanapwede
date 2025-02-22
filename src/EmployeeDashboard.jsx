import { useState, useEffect } from "react";
import LoggedInHeader from "./LoggedInHeader";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [jobType, setJobType] = useState("All Types");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId"); 
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!authToken) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/recommend_jobs/?user_id=${userId}`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${authToken}`, 
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        setJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [authToken]);

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Job Feed</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-500">Filters</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Job Type</label>
                <div className="relative">
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white appearance-none pr-8"
                  >
                    <option>All Types</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-gray-500 mb-4">Recommended for You</h2>

            {loading ? (
              <p className="text-gray-500">Loading jobs...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : jobs.length === 0 ? (
              <p className="text-gray-500">No job recommendations available.</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
    <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{job.job_title}</h3>
      <div className="flex items-center text-gray-600 mb-4">
        <span>{job.comp_name || "Unknown Company"}</span>
        <span className="mx-2">•</span>
        <span>{job.comp_location || "Location not specified"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {job.tags?.split(", ").map((tag, tagIndex) => (
          <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Apply Button */}
      <button
        onClick={() => navigate(`/job-seeker/apply?post_id=${job.post_id}`)} // pending pag redirect 
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Apply Now
      </button>
    </div>
  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
