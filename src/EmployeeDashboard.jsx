import { useState } from "react"
import LoggedInHeader from "./LoggedInHeader"

export default function EmployeeDashboard() {
  const [jobType, setJobType] = useState("All Types")
  const [location, setLocation] = useState("")

  const jobs = [
    {
      title: "Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "Remote",
      tags: ["Full-time", "Flexible Hours", "Remote Work"],
    },
    {
      title: "UX Designer",
      company: "Creative Agency",
      location: "New York, NY",
      tags: ["Full-time", "Accessible Office", "Flexible Schedule"],
    },
    {
      title: "Content Writer",
      company: "Digital Media Co.",
      location: "Remote",
      tags: ["Full-time", "Screen Reader Compatible", "Flexible Hours"],
    },
  ]

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

            <div className="space-y-4">
              {jobs.map((job, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span>{job.company}</span>
                    <span className="mx-2">•</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

