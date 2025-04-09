import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell,Mail } from "lucide-react"

export default function LoggedInHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userType");
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://194.163.40.84/api/get-notifications/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://194.163.40.84/api/mark-notification-read/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ is_read: true }),
      });
  
      if (response.ok) {
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://194.163.40.84/api/mark-all-notifications-read/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
  
      if (response.ok) {
        setNotifications(
          notifications.map((notification) => ({
            ...notification,
            read: true,
          }))
        );
      } else {
        console.error("Failed to mark all notifications as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://194.163.40.84/api/logout/", {
        method: "POST",
       
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
     
        localStorage.removeItem('authToken'); 
        localStorage.clear();
        navigate("/"); 
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between px-4 lg:px-16 bg-white relative">
      <Link to="/" className="flex items-center">
        <img src="/hanapwedelogo.png" alt="Logo" className="h-8 w-auto" />
      </Link>
      <div className="flex items-center gap-4">
      <div className="relative">
          <button
            onClick={()=>navigate("/user-chats")}
            className="relative p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
          >
            <Mail className="h-5 w-5" />
           
            
          </button>
          </div>

     {/* Notifications */}
     <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
             
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />

              {/* Notifications dropdown */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-100">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-sm text-[#4CAF50] hover:text-[#45a049</button>]">
                        Mark all as read
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <span className="text-xs text-gray-500">
  {new Date(notification.timestamp).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}
</span>
                        </div>
                        <p className="text-sm text-gray-600">{notification.action}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t">
                  <Link
                    to="/notifications"
                    className="text-sm text-[#4CAF50] hover:text-[#45a049] font-medium"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
        <button
    onClick={toggleDropdown}
    className="w-10 h-10 rounded-full flex items-center justify-center focus:outline-none"
  >
    <span className="sr-only">Profile</span>
    <img 
      src="/favicon1.png" 
      alt="Profile" 
      className="w-10 h-10 rounded-full object-cover"
    />
  </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-100">
              <ul className="py-2 text-sm text-gray-700">
                <li>
                  <Link
                    to={userRole === "Employee" ? "/job-seeker/profile" : "/employer/profile"}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                </li>

  
                

                <li>
                  <Link
                    to={userRole === "Employee" ? "/job-seeker/dashboard" : "/employer/dashboard"}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>

                {userRole === 'Employee' && (
  <li>
    <Link
      to={"/job-seeker/preferences"}
      className="block px-4 py-2 hover:bg-gray-100"
      onClick={() => setIsDropdownOpen(false)}
    >
      Job Preferences
    </Link>
  </li>
)}

                {userRole === 'Employee' && (
  <li>
    <Link
      to={"/job-seeker/track-job"}
      className="block px-4 py-2 hover:bg-gray-100"
      onClick={() => setIsDropdownOpen(false)}
    >
      Job Tracking
    </Link>
  </li>
)}


<li>
    <Link
      to={"/job-fairs"}
      className="block px-4 py-2 hover:bg-gray-100"
      onClick={() => setIsDropdownOpen(false)}
    >
      Job Fairs
    </Link>
  </li>

                
                {userRole !== "Employee!" && (
  <li>
    <Link
      to={"/hanapwede/forum"}
      className="block px-4 py-2 hover:bg-gray-100"
      onClick={() => setIsDropdownOpen(false)}
    >
      Forum
    </Link>
  </li>
)}





                <li>
                  <Link
                    to={"/faqs/"}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    FAQs
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/privacy-policy/"}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <button
                    
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
