import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions"
import LoggedInHeader from "./LoggedInHeader"
import Header from "./Header"

export default function FAQPage() {
  const isLoggedIn = !!localStorage.getItem("authToken")

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoggedIn ? <LoggedInHeader /> : <Header />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          <p className="mt-4 text-lg text-gray-600">Find answers to common questions about using our platform</p>
        </div>

        <FrequentlyAskedQuestions />

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

