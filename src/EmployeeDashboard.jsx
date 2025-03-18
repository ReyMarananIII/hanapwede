  import { useState, useEffect } from "react";
  import LoggedInHeader from "./LoggedInHeader";
  import { useNavigate } from "react-router-dom";


  export default function EmployeeDashboard() {

    const [location, setLocation] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("authToken");
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("recommended");
    const[ allJobs, setAllJobs] = useState([]);

    
    const handleChat = async (employerId) => {
      try {
        const response = await fetch("http://localhost:8000/api/create_chat/", {
          method: "POST",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employer_id: employerId }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to create chat");
        }
    
        const data = await response.json();
        navigate(`/chat/${data.room_id}`);
      } catch (error) {
        console.error("Error starting chat:", error);
      }
    };
    useEffect(() => {
      if (!authToken) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      fetch(`http://127.0.0.1:8000/api/recommend_jobs/?user_id=${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${authToken}`,
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
          setJobs(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
          setError(error.message);
          setLoading(false);
        });
    }, [authToken]);

    useEffect(() => {
      if (activeTab === "all") {
        fetch("http://127.0.0.1:8000/api/all-jobs/", {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => setAllJobs(data))
          .catch((error) => console.error("Error fetching all jobs:", error));
      }
    }, [activeTab, authToken]);
    


const filteredJobs = (activeTab === "recommended" ? jobs : allJobs).filter((job) =>
    location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true
  );
    return (
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Your Job Feed</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         
            <div className="space-y-6">
 

              <div className="space-y-4">
         

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
            <h2 className="text-sm font-semibold text-gray-500 mb-4">
  {activeTab === "recommended" ? "Recommended for You" : "All Available Jobs"}
</h2>

{loading ? (
  <p className="text-gray-500">Loading jobs...</p>
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
          <span>{job.comp_name || "Unknown Company"}</span>
          <span className="mx-2">•</span>
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
    <span key={disabilitytagIndex} className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
      {disabilitytag}
    </span>
  ))}
</div>
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => navigate(`/job-seeker/apply?post_id=${job.post_id}`)}
            className="bg-[#7cd1ed] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Apply Now
          </button>
          <button
            onClick={() => handleChat(job.posted_by)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
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
      </div>
    );
  }
