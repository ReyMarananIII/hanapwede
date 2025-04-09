"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import LoggedInHeader from "./LoggedInHeader"
import Header from "./Header"
import {
  Accessibility,
  Eye,
  Keyboard,
  Layout,
  Bell,
  FileText,
  Smartphone,
  MessageSquare,
  Briefcase,
  AlertCircle,
  Mail,
  ExternalLink,
  CheckCircle,
  Globe,
} from "lucide-react"

export default function AccessibilityPage() {
  const [isLoggedIn] = useState(!!localStorage.getItem("authToken"))

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {isLoggedIn ? <LoggedInHeader /> : <Header />}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#00BCD4] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white bg-opacity-20 rounded-full mb-6">
          <Accessibility className="h-8 w-8 text-[#7cd1ed]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Accessibility at hanaPWeDe</h1>
          <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto">
            Making job searching and hiring accessible for everyone, including persons with disabilities
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-gray-700 mb-6">
            At hanaPWeDe, we are committed to making job searching and hiring accessible for everyone, including persons
            with disabilities. Our platform is designed to eliminate barriers, allowing job seekers to navigate job
            listings, apply for positions, and connect with employers seamlessly.
          </p>
          <p className="text-gray-700 mb-6">
            We continuously improve our platform to support persons with disabilities, incorporating inclusive design
            and assistive technology. Our goal is to create a job-matching experience that works for all users.
          </p>
          <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Globe className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">WCAG Compliance</h3>
              <p className="text-blue-700">
                hanaPWeDe follows the Web Content Accessibility Guidelines (WCAG) to meet global accessibility
                standards. We also conduct extensive testing with assistive technologies, such as screen readers and
                keyboard navigation, to enhance usability.
              </p>
            </div>
          </div>
        </div>

        {/* Job Seekers Features */}
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Briefcase className="mr-2 h-6 w-6 text-[#4CAF50]" />
          Accessibility Features for Job Seekers
        </h2>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Screen Reader Compatibility</h3>
                <p className="text-gray-700">
                  Our platform is fully compatible with screen readers, enabling visually impaired users to browse job
                  listings, read descriptions, and apply for jobs effortlessly.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <Keyboard className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Keyboard Navigation</h3>
                <p className="text-gray-700">
                  Job seekers can navigate the web app using keyboard shortcuts, making the search and application
                  process accessible for users who have difficulty using a mouse.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <Layout className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Clear and Simple Interface</h3>
                <p className="text-gray-700">
                  The UI is designed with high contrast and readable fonts, ensuring users with visual impairments, such
                  as color blindness or low vision, can easily distinguish between text and background.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Notification Accessibility</h3>
                <p className="text-gray-700">
                  Ensures that job notifications and updates are delivered in real-time, allowing employees to stay
                  updated instantly.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Accessible Forms</h3>
                <p className="text-gray-700">
                  Our job application forms feature clear labels, instructions, and validation alerts, making the
                  process user-friendly for individuals with cognitive or motor disabilities.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <Smartphone className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Responsive Design</h3>
                <p className="text-gray-700">
                  The web app adapts seamlessly to different screen sizes and devices, ensuring accessibility for users
                  who prefer mobile or tablet devices.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-green-100 rounded-full">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Real-time Chat</h3>
                <p className="text-gray-700">
                  Job seekers can directly ask employers about job postings, requirements, and company details through
                  real-time chat, ensuring they have all the necessary information before applying.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employer Features */}
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Briefcase className="mr-2 h-6 w-6 text-[#00BCD4]" />
          Accessibility Features for Employers
        </h2>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Layout className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Simple Job Posting Interface</h3>
                <p className="text-gray-700">
                  Employers can easily post job openings with accessible forms that include tooltips and assistive
                  instructions for a smooth experience.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Notification Accessibility</h3>
                <p className="text-gray-700">
                  Ensures that job notifications and updates are delivered in real-time, allowing employers to stay
                  updated instantly.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Job Fair Posting</h3>
                <p className="text-gray-700">
                  Employers can promote and manage job fairs directly on the platform, providing an opportunity to
                  connect with a diverse pool of job seekers efficiently. Job seekers can also register for job fairs,
                  allowing them to participate and engage with potential employers easily.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-4 mt-1">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Real-time Chat</h3>
                <p className="text-gray-700">
                  Employers can respond to job seekers' inquiries about job postings, qualifications, and expectations
                  through real-time chat. Additionally, they can contact candidates after accepting their application to
                  discuss further steps, facilitating better communication and transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <AlertCircle className="h-6 w-6 text-[#4CAF50] mr-3" />
            <h2 className="text-2xl font-bold">Need Help? Contact Our Support Team</h2>
          </div>

          <p className="text-gray-700 mb-6">
            We're always working to improve accessibility! If you encounter any issues or have suggestions, we'd love to
            hear from you.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Contact Us:</h3>
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-gray-600 mr-3" />
              <a href="mailto:hanapwede@gmail.com" className="text-blue-600 hover:underline">
                hanapwede@gmail.com
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-700">
                Your feedback helps us create a more inclusive experience for everyone. Stay connected for updates as we
                continue to enhance accessibility on hanaPWeDe!
              </p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ExternalLink className="mr-2 h-6 w-6 text-[#4CAF50]" />
           Accessibility Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                <a
                  href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Web Content Accessibility Guidelines (WCAG)
                </a>
              </h3>
              <p className="text-gray-700">
                Learn more about the international standards that guide web accessibility practices.
              </p>
            </div>

    
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#4CAF50] hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50]"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

