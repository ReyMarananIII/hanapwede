import { useState } from "react"
import LoggedInHeader from "./LoggedInHeader"

export default function EmployerProfile() {
  
  const [formData, setFormData] = useState({
    comp_name: "",
    comp_desc: "",
    comp_site: "",
    industry: "",
    location:"",
    contact_no:"",
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
      const response = await fetch("http://localhost:8000/api/employer-profile/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`, 
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("Employer profile submitted successfully!");
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
      <LoggedInHeader />

      <div className="container mx-auto px-4 py-8 flex justify-center items-start">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-semibold mb-6">Complete Your Employer Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Company Name</label>
              <input
                type="text"
                name="comp_name"
                value={formData.comp_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Company Description</label>
              <textarea
                name="comp_desc"
                value={formData.comp_desc}
                onChange={handleChange}
                className="w-full p-2 border rounded-md h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Company Website</label>
              <input
                type="url"
                name="comp_site"
                value={formData.comp_site}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Contact Number</label>
              <input
                type="text"
                name="contact_no"
                value={formData.contact_no}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <button type="submit" className="w-full bg-[#4CAF50] text-white py-2 rounded hover:bg-[#45a049] mt-4">
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}