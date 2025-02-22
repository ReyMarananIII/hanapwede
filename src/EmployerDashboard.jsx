import { useEffect, useState } from "react"; 
import LoggedInHeader from "./LoggedInHeader";

export default function EmployerDashboard() {
  const authToken = localStorage.getItem("authToken");
  const [dashboardData, setDashboardData] = useState({
    active_jobs_count: 0,
    total_applications: 0,
    applicants: [],
    job_posts: [], 
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/employer-dashboard", {
          method: "GET",
          headers: {  
            "Authorization": `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <button className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049]">
            Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Candidates Table */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4">List of Applicants</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-600">Name</th>
                    <th className="text-left p-4 font-medium text-gray-600">Role</th>
                    <th className="text-left p-4 font-medium text-gray-600">Experience</th>
                    <th className="text-left p-4 font-medium text-gray-600">Location</th>
                    <th className="text-left p-4 font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.applicants.length > 0 ? (
                    dashboardData.applicants.map((candidate, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-4">{candidate.applicant_name}</td>
                        <td className="p-4">{candidate.applicant_role}</td>
                        <td className="p-4">{candidate.applicant_experience}</td>
                        <td className="p-4">{candidate.applicant_location}</td>
                        <td className="p-4">{candidate.application_action}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-gray-500">
                        No applications yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Job Postings Table */}
            <h2 className="text-lg font-semibold mt-8 mb-4">Current Job Postings</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-600">Title</th>
                    <th className="text-left p-4 font-medium text-gray-600">Category</th>
                    <th className="text-left p-4 font-medium text-gray-600">Location</th>
                    <th className="text-left p-4 font-medium text-gray-600">Salary</th>
                    <th className="text-left p-4 font-medium text-gray-600">Posted On</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.job_posts.length > 0 ? (
                    dashboardData.job_posts.map((job, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="p-4">{job.job_title}</td>
                        <td className="p-4">{job.category || "N/A"}</td>
                        <td className="p-4">{job.location || "N/A"}</td>
                        <td className="p-4">{job.salary_range ? `₱${job.salary_range}` : "Negotiable"}</td>
                        <td className="p-4">{new Date(job.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4 text-gray-500">
                        No job postings yet
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
            <div className="space-y-4">
              <div className="bg-[#E8F5E9] p-4 rounded-lg">
                <div className="text-sm text-gray-600">Active Jobs</div>
                <div className="text-2xl font-bold text-[#2E7D32]">
                  {dashboardData.active_jobs_count}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Applications</div>
                <div className="text-2xl font-bold">{dashboardData.total_applications}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
