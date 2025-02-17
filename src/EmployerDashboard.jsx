import LoggedInHeader from "./LoggedInHeader"

export default function EmployerDashboard() {
  const candidates = [
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      experience: "3 years",
      location: "Remote",
    },
    {
      name: "Sarah Williams",
      role: "UX Designer",
      experience: "2 years",
      location: "New York, NY",
    },
    {
      name: "Michael Chen",
      role: "Content Writer",
      experience: "2 years",
      location: "Remote",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          <button className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#45a049]">Post New Job</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Potential Candidates</h2>
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
                  {candidates.map((candidate, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="p-4">{candidate.name}</td>
                      <td className="p-4">{candidate.role}</td>
                      <td className="p-4">{candidate.experience}</td>
                      <td className="p-4">{candidate.location}</td>
                      <td className="p-4">
                        <button className="text-[#4CAF50] hover:underline">Contact</button>
                      </td>
                    </tr>
                  ))}
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
                <div className="text-2xl font-bold text-[#2E7D32]">3</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600">Total Applications</div>
                <div className="text-2xl font-bold">12</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

