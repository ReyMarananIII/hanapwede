"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "How do I create an account?",
    answer:
      "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill out the required information including your name, email, and password. Once submitted, you'll receive a verification email to activate your account.",
  },
  {
    id: 2,
    question: "What types of jobs are available on the platform?",
    answer:
      "Our platform offers a wide range of job opportunities specifically designed for individuals with disabilities. This includes remote work, flexible hours positions, and roles in companies with inclusive workplace policies. Jobs span various industries including technology, healthcare, education, customer service, and more.",
  },
  {
    id: 3,
    question: "How can employers contact me?",
    answer:
      "Employers can contact you through our secure messaging system once you've applied to their job posting or if they're interested in your profile. You'll receive notifications via email and on the platform when you have new messages. You can manage your communication preferences in your account settings.",
  },
  {
    id: 4,
    question: "Can I update my disability information later?",
    answer:
      "Yes, you can update your disability information at any time by going to your profile settings. We understand that circumstances may change, and we want to ensure your profile accurately reflects your current situation to help match you with appropriate opportunities.",
  },
  {
    id: 5,
    question: "What accommodations can I request from employers?",
    answer:
      "You can specify accommodation needs in your profile and during the job application process. Common accommodations include flexible working hours, assistive technology, accessible workspaces, and modified job duties. Our platform makes it easy to communicate these needs to potential employers who are committed to providing inclusive workplaces.",
  },
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
      </div>
    </div>
  )
}

