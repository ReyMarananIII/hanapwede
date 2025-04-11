// PlatformStatistics.jsx
import { useEffect, useState } from "react"
import {
  Users,
  Briefcase,
  Building,
  FileText,
  Accessibility,
  Eye,
  Brain,
  Ear,
  ShipWheelIcon as Wheelchair,
  Loader,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { baseURL } from "./constants"
import AdminLayout from "./AdminLayout"
export default function PlatformStatistics() {
  const [statistics, setStatistics] = useState({
    employeeCount: 0,
    employerCount: 0,
    jobsPostedCount: 0,
    disabilityTypes: [],
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")

    if (!authToken) return

    fetch(`${baseURL}/api/platform-statistics/`, {
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch statistics")
        return res.json()
      })
      .then((data) => {
        setStatistics({
          employeeCount: data.employee_count || 0,
          employerCount: data.employer_count || 0,
          jobsPostedCount: data.jobs_posted_count || 0,
          disabilityTypes: data.disability_types || [],
        })
        setLoading(false)
      })
      .catch((err) => {
        console.error("Platform stats error:", err)
        setLoading(false)
      })
  }, [])

  const getDisabilityIcon = (type) => {
    const lower = type.toLowerCase()
    if (lower.includes("visual") || lower.includes("sight") || lower.includes("blind")) return <Eye className="h-5 w-5 text-purple-600" />
    if (lower.includes("hearing") || lower.includes("deaf")) return <Ear className="h-5 w-5 text-purple-600" />
    if (lower.includes("physical") || lower.includes("mobility")) return <Wheelchair className="h-5 w-5 text-purple-600" />
    if (lower.includes("cognitive") || lower.includes("learning")) return <Brain className="h-5 w-5 text-purple-600" />
    return <Accessibility className="h-5 w-5 text-purple-600" />
  }

  return (
    <AdminLayout>
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <FileText className="mr-2 h-5 w-5 text-blue-600" />
        Platform Statistics
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-24">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Seekers</p>
                <p className="text-2xl font-bold text-blue-700">{statistics.employeeCount}</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Employers</p>
                <p className="text-2xl font-bold text-green-700">{statistics.employerCount}</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 flex items-center">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <Briefcase className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Jobs Posted</p>
                <p className="text-2xl font-bold text-amber-700">{statistics.jobsPostedCount}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium mb-3 flex items-center">
              <Accessibility className="mr-2 h-5 w-5 text-purple-600" />
              Disability Types on Platform
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statistics.disabilityTypes.map((type, i) => (
                <div key={i} className="bg-purple-50 rounded-lg p-3 flex items-center">
                  {getDisabilityIcon(type.name)}
                  <span className="ml-3 text-sm font-medium text-purple-800">{type.name}</span>
                </div>
              ))}
            </div>
          </div>


        </>
      )}
    </div>
    </AdminLayout>
  )
}
