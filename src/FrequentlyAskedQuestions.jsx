"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    "id": 1,
    "question": "How do I create an account?",
    "answer": "To create an account, click Job Seeker Login if you’re looking for a job, or Employer Login if you’re posting job listings. Then, select Sign Up Now. After filling out the required information and submitting it, you'll receive a verification email to activate your account. Once activated, you can set up your profile and begin exploring job opportunities or posting job listings."
  },
  {
    "id": 2,
    "question": "How do I search and apply for jobs?",
    "answer": "Once you sign in, you will be directed to your Job Feed or Dashboard, where you can browse Recommended Jobs based on your profile or explore All Jobs. When you find a job that interests you, click Apply Now and follow the instructions to submit your application."
  },
  {
    "id": 3,
    "question": "Can I customize my job recommendations?",
    "answer": "Yes! Your Job Feed is personalized based on your skills, experience, and preferences. You can further refine your recommendations by updating or editing your profile to ensure it accurately reflects your qualifications and needs."
  },
  {
    "id": 4,
    "question": "How do I update my resume and profile?",
    "answer": "To update your profile, go to the Profile section and click Edit Profile. You can:\n- Update your personal information\n- Upload or replace your resume\n- Add new skills or work experience."
  },
  {
    "id": 5,
    "question": "How will I know if I got the job?",
    "answer": "Employers will contact shortlisted candidates through the platform via real-time chat. You will also receive a notification about updates on your application."
  }
]

const faqs2 = [

{
  "id": 1,
  "question": "How do I post a job?",
  "answer": "Employers can post job openings by clicking Post New Job in their dashboard. Fill in the job details, set qualifications, and publish the listing."
},
{
  "id": 2,
  "question": "How do I edit or remove a job post?",
  "answer": "To manage job listings, go to Current Job Postings in the employer Dashboard. From there, you can edit or delete postings as needed."
}
]

export default function FrequentlyAskedQuestions() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {openFaq === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-green-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {openFaq === faq.id && (
                <div className="px-4 pb-4 text-gray-600">
                  <div className="pt-2 border-t border-gray-200">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>


        <h2 className="text-2xl font-bold text-gray-900 mb-8 mt-10">For Employers</h2>

        <div className="space-y-4">
          {faqs2.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {openFaq === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-green-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {openFaq === faq.id && (
                <div className="px-4 pb-4 text-gray-600">
                  <div className="pt-2 border-t border-gray-200">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>


        
      </div>
    </div>
  )
}

