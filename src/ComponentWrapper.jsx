import LoggedInHeader from "./LoggedInHeader"
import { Link } from "react-router-dom"

const ComponentWrapper = ({ top1, top2, bottom }) => {
  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />
      <div className="mx-auto px-4 py-6">
        {/* Top row with phone-sized component and larger component */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Phone-sized container for top1 */}
          <div className="w-full lg:w-[375px] flex-shrink-0 mx-auto lg:mx-0">
       <div className="bg-white rounded-xl shadow-md overflow-hidden h-[1000px] max-h-[120vh] overflow-y-auto hide-scrollbar ">
              <div className="p-4">
                {/* Phone-sized preview */}
                {top1}
              </div>
            </div>
          </div>

          {/* Larger container for top2 that takes remaining space */}
          <div className="flex-grow w-full">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-[1000px] max-h-[120vh] overflow-y-auto hide-scrollbar">
              <div className="p-4">{top2}</div>
            </div>
          </div>
        </div>

        {/* Bottom component spans full width */}
        <div className="w-full">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4">{bottom}</div>
          </div>
        </div>
      </div>

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
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ComponentWrapper
