import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoggedInHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userType");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout/", {
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
     

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center focus:outline-none"
          >
            <span className="sr-only">Profile</span>
            {/* Replace with actual profile image */}
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
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
                <li>
                  <button
                    enabled= "true"
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
