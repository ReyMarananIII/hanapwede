import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import LoggedInHeader from "./LoggedInHeader";

export default function NotFound() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="bg-[#F8FBFF] min-h-screen flex flex-col">
    
      <div className="w-full">
        {isLoggedIn ? <LoggedInHeader /> : <Header />}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <img src="/404image.png" alt="Page Not Found" className="w-64 mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops! Page not found</h1>
        <p className="text-gray-600 text-lg mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="bg-[#4CAF50] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#45a049] transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
