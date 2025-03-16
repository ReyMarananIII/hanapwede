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


      </div>
    </div>
  )
}

