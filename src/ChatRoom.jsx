
import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { Send, ArrowLeft } from "lucide-react"

export default function ChatRoom() {
  const { roomId } = useParams()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const authToken = localStorage.getItem("authToken")
  const username = localStorage.getItem("username")


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]) 


  useEffect(() => {
    setIsLoading(true)
    setError(null)

    fetch(`http://localhost:8000/api/chat/messages/${roomId}/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch chat history")
        }
        return response.json()
      })
      .then((data) => {
        setMessages(data) 
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading chat history:", error)
        setError("Failed to load chat history. Please try again.")
        setIsLoading(false)
      })
  }, [roomId, authToken])


  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/`)
    setSocket(ws)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages((prev) => [...prev, { sender: data.sender, content: data.message }])
    }

    return () => ws.close()
  }, [roomId])

  const sendMessage = () => {
    if (socket && message.trim()) {
      const msgData = { message, sender: username }
      socket.send(JSON.stringify(msgData))
      setMessage("")
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white border-b shadow-sm p-4">
        <div className="flex items-center">
          <button className="mr-3 p-1 rounded-full hover:bg-gray-100" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold">Chat</h2>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-50 text-red-700 p-3 text-center">{error}</div>}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-center mb-2">No messages yet</p>
            <p className="text-center text-sm">Be the first to send a message!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.sender === username

            return (
              <div key={idx} className={`mb-4 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                {!isOwnMessage && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-2 flex-shrink-0">
                    {getInitials(msg.sender)}
                  </div>
                )}

                <div className={`max-w-[75%]`}>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {!isOwnMessage && <div className="font-medium text-sm mb-1">{msg.sender}</div>}
                    <div className="break-words">{msg.content}</div>
                  </div>
                  {msg.timestamp && (
                    <div className={`text-xs mt-1 ${isOwnMessage ? "text-right" : "text-left"} text-gray-500`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

