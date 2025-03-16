"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Header from "./Header"
import LoggedInHeader from "./LoggedInHeader"
import { Shield, ChevronDown, ChevronUp, ExternalLink, Mail, Phone } from "lucide-react"

export default function PrivacyPolicy() {
  const [isLoggedIn] = useState(!!localStorage.getItem("authToken"))
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    user_privacy: false,
    user_rights: false,
    security_policy: false,
    verification: false,
    fake_id: false,
    policy_changes: false,
    responsibilities: false,
    ownership: false,
    liability: false,
    indemnification: false,
    law:false,
    termination:false,
  })

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  const renderSection = (id, title, content) => (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full justify-between items-center text-left focus:outline-none"
      >
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {expandedSections[id] ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {expandedSections[id] && <div className="mt-4 text-gray-600 space-y-4">{content}</div>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? <LoggedInHeader /> : <Header />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
 
          <div className="bg-[#7cd1ed] px-6 py-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-center">Privacy Policy & Terms of Use</h1>

          </div>

       
          <div className="px-6 py-8">
            <div className="prose max-w-none">
              {renderSection(
                "introduction",
                "Introduction",
                <>
                  <p>
                  Welcome to hanaPWeDe, a job matching platform for Persons With Disabilities designed to connect employers with job seekers based on their qualifications and preferences. By using our platform, you agree to comply with these terms of use and our privacy policy.
                  </p>
          
                </>,
              )}

              {renderSection(
                "user_privacy",
                "User Data Privacy and Security Policy",
                <>
                  <p>We collect several types of information from and about users of our platform</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Data Collection:</strong> We collect personal information such as your name, email, job preferences, skills, and other relevant details to provide a better job-matching experience.

                    </li>
                    <li>
                      <strong>Data Storage:</strong> Your data is stored securely in a phpMyAdmin database hosted by Hostinger. We take reasonable steps to protect your data from unauthorized access, and backups are regularly maintained to ensure data integrity.
                    </li>
                    <li>
                      <strong>Data Usage:</strong> Your data is used solely for job matching purposes and will not be shared with any third parties without your explicit consent.

                    </li>
                    <li>
                      <strong>User Consent:</strong> By using this platform, you consent to the collection, storage, and use of your personal data as outlined in this policy.
                    </li>
                  </ul>
                  <p className="mt-4">We collect this information when you:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Register for an account</li>
                    <li>Complete your profile</li>
                    <li>Upload your PWD ID card</li>
                    <li>Apply for jobs</li>
                    <li>Communicate with employers</li>
                  </ul>
                </>,
              )}

              {renderSection(
                "user_rights",
                "User Rights & Data Control",
                <>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Right to Access & Edit Information:</strong> Users have the right to view, update, or delete their personal data. Account settings allow users to modify personal information as needed.
                    </li>
                    <li>
                      <strong>Account Deletion Request:</strong> Users can request account deletion through the platform. Upon approval, personal data will be permanently removed, except where retention is required by law or for security purposes.
                    </li>
                    
                  </ul>
              
                </>,
              )}

              {renderSection(
                "security_policy",
                "Security Policy",
                <>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Password Hashing:</strong> All passwords stored in our database are hashed using secure algorithms (e.g., bcrypt) to ensure that they cannot be compromised in the event of unauthorized access.
                    </li>
                    <li>
                      <strong> Data Encryption:</strong> Sensitive information is encrypted both in transit and at rest, providing additional security against unauthorized access.
                    </li>
                    <li>
                      <strong>Incident Response:</strong> In the event of a security breach, affected users will be notified promptly, and we will take steps to resolve the issue, including restoring data from secure backups.
                    </li>
                  </ul>
                    <p className="mt-4">
                        We take the security of your data seriously and are committed to maintaining the confidentiality and integrity of your personal information.
                </p>
                </>,
              )}

              {renderSection(
                "verification",
                "PWD Verification Process",
                <>
    

       <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong> Mandatory Persons With Disabilities (PWD) Verification:</strong> Since hanaPWeDe is exclusively for job seekers with disabilities, all job seekers are required to declare their Persons with Disabilities status during registration and upload a valid government-issued Persons with Disabilities ID.
                    </li>
                    <li>
                      <strong> Document Submission:</strong> Job seekers must upload their Persons with Disabilities identification upon registration. The document can be verified manually by platform administrators or through an automated ID verification service.
                    </li>
                    <li>
                      <strong>Review and Approval Process:</strong> The platform team reviews the submitted documentation. This includes checking the authenticity of the document. If the document passes verification, the user’s account is granted.
                    </li>

                    <br/> 
                      <strong>Notification of Status  </strong> 
                      <br/> 
                      <br/> 

                    <li>
                      <strong>Approved:</strong> Once verified, users will be notified via app notification.
                    </li>
                    <br/> 
                    <li>
                      <strong>Rejected:</strong> If the document is rejected (e.g., due to unclear image, expired document, or fake ID), users will be notified with instructions to submit a valid document.
                    </li>
                  </ul>
           
      
                </>,
              )}

              {renderSection(
                "fake_id",
                "Handling of Fake ID Submissions",
                <>
       
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Investigation:</strong> If a fake or invalid PWD ID is suspected, the platform team will investigate by cross-referencing official records or contacting relevant authorities. Users will be given an opportunity to provide additional information or clarify their status.
                    </li>
                    <li>
                      <strong>Account Suspension:</strong> If a user is found to have submitted a fake or invalid PWD ID, their account will be immediately suspended. They will receive a notification explaining the reason for the suspension.
                    </li>
                    <li>
                      <strong>Permanent Ban:</strong> Following investigation, if it is confirmed that the user intentionally used fraudulent documents, their account will be permanently banned.
                    </li>
                    <li>
                      <strong>Legal Action:</strong> In cases of severe fraud, the platform may report the incident to relevant authorities, particularly if local laws require reporting of fraudulent activities.
                    </li>
                    <li>
                      <strong>Appeal Process:</strong> Users can file an appeal if they believe the verification decision was incorrect. The platform will review the appeal and provide a final decision within a specified time frame.
                    </li>
       
 
                  </ul>
   
                </>,
              )}

{renderSection("policy_changes", "Changes to Policy", <>
                    <p>
                      We reserve the right to update this policy as necessary. Users will be notified of significant changes and will be required to review and accept the new terms before continuing to use the platform.
                    </p>
                  </>)}


              {renderSection(
                "responsibilities",
                "User Responsibilities",
                <>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Accuracy of Information:</strong>Employers and job seekers are responsible for providing accurate and truthful information. Any misrepresentation or falsification of credentials may result in account suspension or termination.
                    </li>
                    <li>
                      <strong>Prohibited Activities:</strong>Users are prohibited from engaging in activities such as spamming, posting fraudulent job listings, or attempting to compromise the security of the platform.
                    </li>
                  </ul>
                </>,
              )}

              {renderSection(
                "ownership",
                "Content Ownership",
                <>
                    <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>User Content:</strong> Users retain ownership of the content they upload (e.g., resumes, job posts), but grant the platform a non-exclusive license to display and process this content for job-matching purposes.
                    </li>
                    <li>
                      <strong>Intellectual Property:</strong> All intellectual property related to hanaPWeDe, including the job-matching algorithm, belongs to the developers and cannot be copied, reverse-engineered, or used without permission.
                    </li>
                  </ul>
                </>,
              )}

              {renderSection(
                "liability",
                "Limitation of Liability",
                <>
                  <ul className="list-disc pl-5 space-y-2">
                    <p>
                     hanaPWeDe only facilitates job matching and is not responsible for employer conduct, salary disputes, or hiring decisions. We strive to maintain a secure and functional platform, but hanaPWeDe cannot be held liable for any damages resulting from system downtime, data breaches, or mismatches in job recommendations.

                    </p>
                  </ul>
                </>,
              )}

{renderSection(
                "indemnification",
                "Indemnification ",
                <>
         <ul className="list-disc pl-5 space-y-2">
                    <p>
                     Users agree to indemnify and hold hanaPWeDe harmless from any claims, damages, or legal disputes resulting from their use of the platform.
                    </p>
                  </ul>
                </>,
              )}

{renderSection(
                "law",
                "Governing Law ",
                <>
              <ul className="list-disc pl-5 space-y-2">
                    <p>
                    This policy is governed by the laws of the jurisdiction in which the developers operate. Any disputes shall be resolved under the applicable legal framework.
                    </p>
                  </ul>
                </>,
              )}

{renderSection(
                "termination",
                "Account Termination ",
                <>
                   <ul className="list-disc pl-5 space-y-2">
                    <p>
                  We reserve the right to suspend or terminate accounts that violate these terms, particularly for users engaging in prohibited activities or misrepresentation of information.
                    </p>
                  </ul>
                </>,
              )}

          
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                By using our platform, you acknowledge that you have read and understood this Privacy Policy.
              </p>
              <div className="mt-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7cd1ed] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

