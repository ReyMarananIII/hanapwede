import FrequentlyAskedQuestions from "./FrequentlyAskedQuestions"

export default function FAQSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600">Find answers to the most common questions about our platform</p>
        </div>

        <FrequentlyAskedQuestions />

        <div className="mt-8 text-center">
          <a href="/faq" className="text-green-600 hover:text-green-700 font-medium">
            View all FAQs
          </a>
        </div>
      </div>
    </section>
  )
}

