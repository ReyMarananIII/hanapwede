import { Clock, CheckCircle, XCircle, Calendar, AlertCircle } from "lucide-react"

export default function ApplicationStatusBadge({ status }) {
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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Approved":
        return <CheckCircle className="h-4 w-4" />
      case "Declined":
        return <XCircle className="h-4 w-4" />
      case "Interviewed":
        return <Calendar className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(status)}`}
    >
      {getStatusIcon(status)}
      <span className="ml-1">{status}</span>
    </span>
  )
}

