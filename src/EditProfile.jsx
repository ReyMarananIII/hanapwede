"use client"

import { useState, useEffect } from "react"
import LoggedInHeader from "./LoggedInHeader"
import Header from "./Header"
import { useNavigate } from "react-router-dom"
import {User } from "lucide-react"
import { baseURL } from './constants';
import Swal from 'sweetalert2'

export default function EditProfile() {
    const handleError = (message) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
      });
    };
  
    const handleSuccess = (message) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: message
      });
    }
  const [activeTab, setActiveTab] = useState("about")
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profilePicture, setProfilePicture] = useState(null);
const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const userId = localStorage.getItem("userId")
  const [skills, setSkills] = useState([])
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)

 
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${baseURL}/api/get-user-details`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
      
          setFormData({
            full_name: data.profile.full_name || "",
            pro_headline: data.profile.pro_headline || "",
            bio: data.profile.bio || "",
            email: data.profile.email || "",
            contact_no: data.profile.contact_no || "",
            location: data.profile.location || "",
            experience: data.profile.experience || "",
            role: data.profile.role || "",
            user: userId,
          })

          // Set skills if available
          if (data.profile.skills) {
            setSkills(data.profile.skills.split(",").filter((skill) => skill.trim()))
   
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    if (token && userId) {
      fetchUserProfile()
    }
  }, [userId])

  const [formData, setFormData] = useState({
    full_name: "",
    pro_headline: "",
    bio: "",
    email: "",
    contact_no: "",
    location: "",
    experience: "",
    role: "",
    user: userId,
  })


  const [currentSkill, setCurrentSkill] = useState("")
  const [resume, setResume] = useState(null)

  const [changedFields, setChangedFields] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
  
  // Track only changed fields
  setChangedFields((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSkillInput = (e) => {
  if (e.key === "Enter" && currentSkill.trim()) {
    e.preventDefault();
    if (!skills.includes(currentSkill.trim())) {
      const updatedSkills = [...skills, currentSkill.trim()];
      setSkills(updatedSkills);

      // Track the change
      setChangedFields((prev) => ({
        ...prev,
        skills: updatedSkills.join(","),
      }));
    }
    setCurrentSkill("");
  }
};

const removeSkill = (skillToRemove) => {
  const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
  setSkills(updatedSkills);

  // Track the change
  setChangedFields((prev) => ({
    ...prev,
    skills: updatedSkills.join(","),
  }));
};


const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (
    file &&
    (file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
  ) {
    setResume(file);

    // Track the file change
    setChangedFields((prev) => ({
      ...prev,
      resume: file, // Store the file reference
    }));
  } else {
    handleError("Please upload a PDF or Word document");
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formDataToSend = new FormData();

    // Append only changed fields
    Object.keys(changedFields).forEach((key) => {
      formDataToSend.append(key, changedFields[key]);
    });

    // Ensure skills are included
    if (skills.length > 0) {
      formDataToSend.append("skills", skills.join(","));
    }
 
    
    if (profilePicture) {
      formDataToSend.append("profile_picture", profilePicture);
    }


    // Append resume with correct field name
    if (resume) {
      formDataToSend.append("employee_resume", resume);  // ✅ Change the key here
    }

    const response = await fetch(`${baseURL}/api/edit-profile/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${localStorage.getItem("authToken")}`,
      },
      body: formDataToSend, // No need for Content-Type
    });

    if (response.ok) {
      handleSuccess("Profile updated successfully!");
      navigate("/employee-components");
    } else {
      console.error("Error submitting profile:", response.statusText);
      handleError("Failed to submit profile");
    }
  } catch (error) {
    console.error("Error:", error);
    handleError("An error occurred. Please try again.");
  }
};

  
  

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {isLoggedIn ? <LoggedInHeader /> : <Header />}
      <div className="h-40 bg-gradient-to-r from-[#4CAF50] to-[#00BCD4]" />

      <div className="container mx-auto px-4 -mt-20">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-end gap-4">
            <div className="flex items-center justify-center text-gray-400 mb-4">
                      <User className="w-12 h-12" />
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
        
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "about" && (
                <>

<div>
  <label className="block text-sm mb-2">Profile Picture</label>
  <input
    type="file"
    accept="image/*"
  onChange={(e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    setProfilePicture(file);
    setProfilePicturePreview(URL.createObjectURL(file)); 
    setChangedFields((prev) => ({
      ...prev,
      profile_picture: file,
    }));
  } else {
    handleError("Please select a valid image file (JPEG, PNG, etc.)");
  }
}}
    className="w-full p-2 border rounded-md"
  />
  {profilePicturePreview && (
    <img
      src={profilePicturePreview}
      alt="Preview"
      className="mt-2 w-24 h-24 rounded-full object-cover border"
    />
  )}
</div>
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
                </>
              )}

              {activeTab === "experience" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Your current or desired role"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Experience</label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Describe your work experience..."
                      className="w-full p-2 border rounded-md h-32"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Skills (Press Enter to add)</label>
                    <input
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={handleSkillInput}
                      placeholder="Add skills relevant to your job applications"
                      className="w-full p-2 border rounded-md"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Resume/CV</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#4CAF50] hover:text-[#45a049] focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF or Word up to 10MB</p>
                        {resume && <p className="text-sm text-[#4CAF50]">Selected: {resume.name}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            

              <button type="submit" className="bg-[#4CAF50] text-white px-6 py-2 rounded hover:bg-[#45a049]">
                Save Changes
              </button>
            </form>
          </div>

      
        </div>
      </div>
    </div>
  )
}

