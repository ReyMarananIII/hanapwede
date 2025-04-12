import React from 'react';
import LoggedInHeader from './LoggedInHeader';
import { Link } from "react-router-dom";

const ComponentWrapper = ({ top1, top2, bottom }) => {
  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <LoggedInHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {/* Top 1 and Top 2 */}
        <div className="p-4 rounded-xl  bg-white">{top1}</div>
        <div className="p-4 rounded-xl bg-white">{top2}</div>

        {/* Bottom spans full width */}
        <div className="col-span-1 sm:col-span-2 p-4 rounded-xl  bg-white">
          {bottom}
        </div>
      </div>
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
};

export default ComponentWrapper;
