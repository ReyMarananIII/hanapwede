import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoggedInHeader from "./LoggedInHeader";

export default function JobApplication() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("post_id");
 

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_role: "",
    applicant_experience: "",
    applicant_location: "",
  });

  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setError("Job not found.");
      setLoading(false);
      return;
    }

    fetch(`http://194.163.40.84/api/job/${jobId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job details");
        return res.json();
      })
      .then((data) => {
    
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [jobId]);

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillInput = (e) => {
    if (e.key === "Enter" && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
      }
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
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
    } else {
      alert("Please upload a PDF or Word document");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formDataToSend = new FormData();
    formDataToSend.append("applicant_name", formData.applicant_name);
    formDataToSend.append("applicant_role", formData.applicant_role);
    formDataToSend.append("applicant_experience", formData.applicant_experience);
    formDataToSend.append("applicant_location", formData.applicant_location);
    formDataToSend.append("applicant_skills", skills.join(",")); 
    formDataToSend.append("job_post", jobId);

    formDataToSend.append("application_action", "For Approval");


    if (resume) {
      formDataToSend.append("resume", resume);
    }
  
    try {
      const response = await fetch("http://194.163.40.84/api/submit-application/", {
        headers: {
          "Authorization": `Token ${localStorage.getItem("authToken")}`, 
        },
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
  
      alert("Application submitted successfully!");
      setFormData({
        applicant_name: "",
        applicant_role: "",
        applicant_experience: "",
        applicant_location: "",
      });
      setSkills([]);
      setResume(null);
    } catch (error) {
      alert("Error submitting application: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F8FBFF] py-8 px-4">
          <LoggedInHeader />
      <div className="max-w-3xl mx-auto">
        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{job.job_title}</h1>
              <p className="text-gray-600">{job.comp_name}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E8F5E9] text-[#2E7D32]">
              {job.job_type}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E8F5E9] text-[#2E7D32]">
              {job.location}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E8F5E9] text-[#2E7D32]">
              {job.salary_range}
            </span>
          </div>
          <p className="text-gray-600">{job.job_desc}</p>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6">Submit Your Application</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  name="applicant_role"
                  value={formData.applicant_role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <input
                  type="text"
                  name="applicant_experience"
                  value={formData.applicant_experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="applicant_location"
                  value={formData.applicant_location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleSkillInput}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-sm">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-2">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg">
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
                      className="relative cursor-pointer rounded-md font-medium text-[#4CAF50] hover:text-[#45a049] focus-within:outline-none"
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
                  {resume && <p className="text-sm text-[#4CAF50]">Selected: {resume.applicant_name}</p>}
                </div>
              </div>
            </div>

            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
