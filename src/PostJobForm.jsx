import { useState,useEffect } from "react"
import Header from "./Header"
import LoggedInHeader from "./LoggedInHeader"

export default function PostJobForm() {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [disabilityTags, setDisabilityTags] = useState([]); // Store disability tags
const [selectedTags, setSelectedTags] = useState([]);

useEffect(() => {
      const token = localStorage.getItem("authToken"); 
      setIsLoggedIn(!!token);
      fetch("http://localhost:8000/api/disability-tags/", {
        headers: token ? { Authorization: `Token ${token}` } : {}
    })
      .then((res) => res.json())
      .then((data) => setDisabilityTags(data))
      .catch((error) => console.error("Error fetching disability tags:", error));
    }, []);
    {/*tags: "",*/}
      {/*tags: "",*/}
  const [formData, setFormData] = useState({
    job_title: "",
    job_desc: "",
    job_type: "Full Time",
    skills_req: "",
    category:"Technology",
    salary_range: "",
    location: "", 
  
    disabilitytag: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    const tagId = Number(value);  // Ensure it’s a number

    setSelectedTags((prevTags) =>
        checked ? [...prevTags, tagId] : prevTags.filter((tag) => tag !== tagId)
    );
};
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("authToken");

  if (!token) {
      alert("You must be logged in to post a job.");
      return;
  }

  try {
    console.log(formData)
      const response = await fetch("http://localhost:8000/api/post-job/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`, 
          },
          body: JSON.stringify({ ...formData, disabilitytag: selectedTags }),
      });

      if (response.ok) {
          alert("Job posted successfully!");
      } else {
          console.error("Error posting job:", response.statusText);
          alert("Failed to post job");
      }
  } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
  }
};
  

  return (
  <div className="min-h-screen bg-[#F8FBFF]">
      {isLoggedIn ? <LoggedInHeader /> : <Header />}
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm mb-2">Job Title</label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            placeholder="Enter job title"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Job Description</label>
          <textarea
            name="job_desc"
            value={formData.job_desc}
            onChange={handleChange}
            placeholder="Enter job description"
            className="w-full p-2 border rounded-md h-32 resize-none"
            required
          />
        </div>



        <div>
          <label className="block text-sm mb-2">Category</label>
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white appearance-none"
              required
            >
              <option value="Technology">Technology</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Job Type</label>
          <div className="relative">
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md bg-white appearance-none"
              required
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
            <label className="block text-sm mb-2">Recognized Disabilities</label>
            <div className="grid grid-cols-2 gap-2">
              {disabilityTags.map((tag) => (
                <label key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={tag.id}
                    checked={selectedTags.includes(tag.id)}
                    onChange={handleTagChange}
                    className="mr-2"
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

        <div>
          <label className="block text-sm mb-2">Required Skills (comma separated)</label>
          <input
            type="text"
            name="skills_req"
            value={formData.skills_req}
            onChange={handleChange}
            placeholder="Communication, Teamwork, Creativity"
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
            placeholder="Enter job location"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Salary Range</label>
          <input
            type="text"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
            placeholder="Enter salary range"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button type="submit" className="bg-[#4CAF50] text-white px-6 py-2 rounded hover:bg-[#45a049]">
          Post Job
        </button>
      </form>
    </div>
    </div>
  )
}
