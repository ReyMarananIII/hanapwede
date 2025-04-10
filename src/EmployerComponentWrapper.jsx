import React from 'react';
import LoggedInHeader from './LoggedInHeader';
const EmployerComponentWrapper = ({ top1, top2, top3, bottom }) => {
    return (
      <div className="min-h-screen bg-[#F8FBFF]">
        <LoggedInHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-auto gap-4 p-4">
      
          <div className="p-4 rounded-xl shadow-md bg-white">{top1}</div>
          <div className="p-4 rounded-xl shadow-md bg-white">{top2}</div>
          <div className="p-4 rounded-xl shadow-md bg-white">{top3}</div>
  
      
          <div className="sm:col-span-2 lg:col-span-3 p-4 rounded-xl shadow-md bg-white">
            {bottom}
          </div>
        </div>
      </div>
    );
  };
  
  
  export default EmployerComponentWrapper;