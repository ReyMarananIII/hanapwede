import React from 'react';
import LoggedInHeader from './LoggedInHeader';

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
    </div>
  );
};

export default ComponentWrapper;
