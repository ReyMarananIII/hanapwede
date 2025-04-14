
import LoggedInHeader from "./LoggedInHeader"
import Header from "./Header"
import { useEffect, useState } from "react"
import { baseURL } from './constants';
import { useNavigate } from "react-router-dom"
import {
  MessageSquare,
  Search,
  Plus,
  User,
  Clock,
  AlertCircle,
  Loader,
  MessageSquareOff,
  ChevronRight,
} from "lucide-react"

export default function UserChats() {
  const [chats, setChats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const authToken = localStorage.getItem("authToken")
  const username = localStorage.getItem("username")
  const navigate = useNavigate()


  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetch(`${baseURL}/api/user-chats/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch chat rooms")
        }
        return response.json()
      })
      .then((data) => {
        setChats(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading chats:", error)
        setError("Failed to load your chats. Please try again.")
        setIsLoading(false)
      })
  }, [authToken])

 
  const filteredChats = chats.filter((chat) => chat.other_user.toLowerCase().includes(searchTerm.toLowerCase()))

  
  const formatTime = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }


  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF] z-50">
            <LoggedInHeader />
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
   
      {/* Header */}
      <div className="sticky top-0 bg-white z-50 border-b shadow-sm">
        <div className="p-4 z-50">
          <h1 className="text-2xl font-bold flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            My Conversations
          </h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Chat List */}
      <div className="divide-y">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="ml-2">Loading conversations...</span>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {searchTerm ? (
              <>
                <Search className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                <p className="text-gray-500">We couldn't find any conversations matching "{searchTerm}"</p>
              </>
            ) : (
              <>
                <MessageSquareOff className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                <p className="text-gray-500 mb-4">Start chatting with other users to see your conversations here</p>
              
              </>
            )}
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.room_id}
              className="p-4 hover:bg-gray-50 transition cursor-pointer flex items-center"
              onClick={() => navigate(`/chat/${chat.room_id}`)}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-4 flex-shrink-0 overflow-hidden">
  {chat.other_user_profile_picture ? (
    <img
      src={`${baseURL}/media/${chat.other_user_profile_picture}`}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    getInitials(chat.other_user)
  )}
</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-semibold truncate">{chat.other_user}</h3>
                  <span className="text-xs text-gray-500 flex items-center whitespace-nowrap ml-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(chat.last_timestamp)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="text-xs">{chat.other_user_type}</span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">{chat.last_message || "No messages yet"}</p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  )
}

