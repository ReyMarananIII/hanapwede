import { useState,useEffect } from "react"
import LoggedInHeader from "./LoggedInHeader"
import Header from "./Header"
import { useNavigate } from "react-router-dom"

export default function EditProfile() {
  const [activeTab, setActiveTab] = useState("about")
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId =  localStorage.getItem('userId')
  
    useEffect(() => {
      const token = localStorage.getItem("authToken"); 
      setIsLoggedIn(!!token);
    }, []);
  const [formData, setFormData] = useState({
    full_name: "",
    pro_headline: "",
    bio: "",
    email: "",
    contact_no: "",
    location: "",
    user:userId,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {

      const response = await fetch("http://194.163.40.84/api/edit-profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`, 
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Employee profile updated successfully!");
        navigate("/job-seeker/profile")
      } else {
        console.error("Error submitting profile:", response.statusText);
        alert("Failed to submit profile");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
            {isLoggedIn ? <LoggedInHeader /> : <Header />}
      <div className="h-40 bg-gradient-to-r from-[#4CAF50] to-[#00BCD4]" />
 
      <div className="container mx-auto px-4 -mt-20">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-end gap-4">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white">
              <img src="/placeholder.svg" alt="Profile" className="w-full h-full rounded-full" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-4">Edit Profile</h1>
          </div>
       
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Tabs */}
            <div className="flex gap-6 border-b mb-6">
              <button
                className={`pb-2 px-1 ${
                  activeTab === "about" ? "border-b-2 border-[#4CAF50] text-[#4CAF50]" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
              <button
                className={`pb-2 px-1 ${
                  activeTab === "experience" ? "border-b-2 border-[#4CAF50] text-[#4CAF50]" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("experience")}
              >
                Experience
              </button>
              <button
                className={`pb-2 px-1 ${
                  activeTab === "announcements" ? "border-b-2 border-[#4CAF50] text-[#4CAF50]" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("announcements")}
              >
                Announcements
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Professional Headline</label>
                <input
                  type="text"
                  name="pro_headline"
                  value={formData.pro_headline}
                  onChange={handleChange}
                  placeholder="E.g., Frontend Developer at Tech Company"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">About Me</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a brief summary about yourself..."
                  className="w-full p-2 border rounded-md h-32"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Type of Disability</label>
                <select
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md bg-white"
                >
                  <option value="">Select disability type</option>
                  <option value="visual">Visual Impairment</option>
                  <option value="hearing">Hearing Impairment</option>
                  <option value="physical">Physical Disability</option>
                  <option value="cognitive">Cognitive Disability</option>
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Contact Information</h3>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <button type="submit" className="bg-[#4CAF50] text-white px-6 py-2 rounded hover:bg-[#45a049]">
                Save Changes
              </button>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Profile Views</div>
                <div className="text-2xl font-semibold">24</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Job Applications</div>
                <div className="text-2xl font-semibold">5</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}