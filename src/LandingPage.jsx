import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import LoggedInHeader from "./LoggedInHeader"; 
import { useNavigate } from "react-router-dom";
import { baseURL } from './constants';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken"); 
    setIsLoggedIn(!!token);
  }, []);
  const handleJoinAsCandidate = () => {
    const authToken = localStorage.getItem("authToken"); 
    if (authToken) {
      navigate("/employee-components");
    } else {
      navigate("/job-seeker/signup");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken"); 
    setIsLoggedIn(!!token);
  
    fetch(`${baseURL}/api/all-jobs-public/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Shuffle the array
        const shuffled = data.sort(() => 0.5 - Math.random());
        // Slice the first 4
        setFeaturedJobs(shuffled.slice(0, 4));
      })
      .catch((error) => {
        console.error("Error fetching featured jobs:", error);
      });
  }, []);

  const handlePostJobUpdate = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/hanapwede/forum");
    } else {
      navigate("/job-seeker/signin");
    }
  };

  const handlePostAJob = () => {  
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/employer/post-job");
    } else {
      navigate("/employer/signup");
    }
  }
  const [featuredJobs, setFeaturedJobs] = useState([]);


  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {isLoggedIn ? <LoggedInHeader /> : <Header />}

      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold">Join the Most Inclusive Job Platform in the Philippines</h1>
            <p className="text-gray-600">
              Connect with employers who value diversity and create opportunities for everyone. Your next career move
              starts here.
            </p>
       
            <div className="flex gap-4">
              <button 
              onClick={handleJoinAsCandidate}
              className="bg-[#4CAF50] text-white px-6 py-2 rounded hover:bg-[#45a049]">
                Join as Candidate
              </button>

              {isLoggedIn && (
  <button 
    onClick={handlePostAJob}
    className="border border-[#4CAF50] text-[#4CAF50] px-6 py-2 rounded hover:bg-gray-50">
      Post a Job
  </button>
)}

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
              <h3 className="text-xl font-semibold mb-2">{job.job_title}</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <span>{job.comp_name}</span>
                <span className="mx-2">•</span>
                <span>{job.location}</span>
              </div>
              <div className="flex flex-wrap gap-2">
              {job.tags?.split(",").map((tag, tagIndex) => (
  <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
    {tag.trim()}
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
          <button 
          onClick={handlePostJobUpdate}
          
          className="text-[#4CAF50] hover:text-[#45a049] font-medium">See Updates</button>
        </div>
      </section>

  
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
                  <Link to="/privacy-policy" className="hover:text-[#4CAF50]">
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link to="/accessibility" className="hover:text-[#4CAF50]">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Help</h3>
              <ul className="space-y-2 text-gray-600">
                
                <li>
                  <Link to="/FAQS" className="hover:text-[#4CAF50]">
                    Frequently Asked Questions
                  </Link>
                </li>
                 {/* 
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

                */}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
