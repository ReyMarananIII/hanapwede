import { useState } from "react"
import LoggedInHeader from "./LoggedInHeader"

export default function EmployerProfile() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    industry: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

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
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Company Description</label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                className="w-full p-2 border rounded-md h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Company Website</label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
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

            <button type="submit" className="w-full bg-[#4CAF50] text-white py-2 rounded hover:bg-[#45a049] mt-4">
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}