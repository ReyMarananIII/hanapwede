import { Link } from "react-router-dom"
import Header from "./Header"


export default function LandingPage() {
  const featuredJobs = [
    {
      title: "Software Developer",
      company: "Tech Solutions Inc.",
      location: "Manila, Philippines",
      tags: ["Full-time", "Flexible Hours", "Screen Reader Compatible"],
    },
    {
      title: "Customer Support Specialist",
      company: "AccessWare Solutions",
      location: "Cebu, Philippines",
      tags: ["Full-time", "Wheelchair Accessible", "Sign Language Interpreter"],
    },
    {
      title: "Data Analyst",
      company: "DataCore Inc.",
      location: "Makati, Philippines",
      tags: ["Full-time", "Flexible Schedule", "Assistive Technology"],
    },
    {
      title: "Frontend Developer",
      company: "WebPH Solutions",
      location: "Quezon City, Philippines",
      tags: ["Full-time", "Remote Work", "Flexible Hours"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <Header />

   
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold">Join the Most Inclusive Job Platform in the Philippines</h1>
            <p className="text-gray-600">
              Connect with employers who value diversity and create opportunities for everyone. Your next career move
              starts here.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-semibold">1000+ Candidates</div>
              </div>
              <div>
                <div className="font-semibold">500+ Companies</div>
              </div>
              <div>
                <div className="font-semibold">2000+ Jobs</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-[#4CAF50] text-white px-6 py-2 rounded hover:bg-[#45a049]">
                Join as Candidate
              </button>
              <button className="border border-[#4CAF50] text-[#4CAF50] px-6 py-2 rounded hover:bg-gray-50">
                Post a Job
              </button>
            </div>
          </div>
          <div>
            <img
              src="/herosection.jpeg"
              alt="Workspace with laptops and office equipment"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Featured Jobs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredJobs.map((job, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <span>{job.company}</span>
                <span className="mx-2">•</span>
                <span>{job.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Company Updates Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Latest Company Updates</h2>
          <p className="text-gray-600 mb-4">Stay updated with company news and featured opportunities</p>
          <button className="text-[#4CAF50] hover:text-[#45a049] font-medium">Post Update</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white mt-12 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">About Us</h3>
              <p className="text-gray-600">
                Dedicated to creating equal employment opportunities for people with disabilities
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/find-jobs" className="hover:text-[#4CAF50]">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/for-employers" className="hover:text-[#4CAF50]">
                    For Employers
                  </Link>
                </li>
                <li>
                  <Link to="/accessibility" className="hover:text-[#4CAF50]">
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[#4CAF50]">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/support" className="hover:text-[#4CAF50]">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="hover:text-[#4CAF50]">
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-[#4CAF50]">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

