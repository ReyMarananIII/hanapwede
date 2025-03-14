"use client"

import { useState } from "react"
import { Link, useLocation,useNavigate } from "react-router-dom"
import {
  Users,
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  BadgeCheck,
  MessageSquare,
  FileText,
  HelpCircle,
} from "lucide-react"

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
    const navigate = useNavigate()
  const navigation = [

    { name: "User Approval", href: "/admin/user-approval", icon: Users },

  ]

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
    <div className="min-h-screen bg-gray-100">
   
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? "" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <BadgeCheck className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href ? "bg-indigo-900 text-white" : "text-indigo-100 hover:bg-indigo-700"
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <item.icon className="mr-4 h-6 w-6 text-indigo-300" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
            <button onClick={handleLogout} className="flex-shrink-0 group block w-full flex items-center">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-base font-medium text-white group-hover:text-indigo-200 flex items-center">
                    <LogOut className="mr-2 h-5 w-5" />
                    Log out
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>


      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-indigo-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <BadgeCheck className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-xl font-bold">Admin Panel</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href ? "bg-indigo-900 text-white" : "text-indigo-100 hover:bg-indigo-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon className="mr-3 h-5 w-5 text-indigo-300" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-indigo-100 hover:bg-indigo-700"
            >
              <LogOut className="mr-3 h-5 w-5 text-indigo-300" />
              Log out
            </button>
          </div>
        </div>
      </div>


      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

